import fetch from 'node-fetch';
import config from '../config/index.js';

const GITHUB_API = 'https://api.github.com';

function getHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'PitchSync/1.0',
  };
  if (config.github.token) {
    headers['Authorization'] = `Bearer ${config.github.token}`;
  }
  return headers;
}

async function ghFetch(path) {
  const res = await fetch(`${GITHUB_API}${path}`, { headers: getHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err.message || `GitHub API error: ${res.status}`), {
      status: res.status,
    });
  }
  return res.json();
}

async function ghFetchText(path) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: { ...getHeaders(), Accept: 'application/vnd.github.raw+json' },
  });
  if (!res.ok) return null;
  return res.text();
}

export function parseRepoUrl(url) {
  const patterns = [
    /github\.com\/([^/]+)\/([^/\s?#]+)/,
    /^([^/]+)\/([^/]+)$/,
  ];
  for (const pat of patterns) {
    const m = url.trim().replace(/\.git$/, '').match(pat);
    if (m) return { owner: m[1], repo: m[2] };
  }
  throw new Error('Invalid GitHub repository URL');
}

export async function fetchRepoData(repoUrl) {
  const { owner, repo } = parseRepoUrl(repoUrl);

  // Fetch in parallel
  const [repoMeta, languages, readme, packageJson, topics] = await Promise.allSettled([
    ghFetch(`/repos/${owner}/${repo}`),
    ghFetch(`/repos/${owner}/${repo}/languages`),
    ghFetchText(`/repos/${owner}/${repo}/readme`),
    ghFetchText(`/repos/${owner}/${repo}/contents/package.json`),
    ghFetch(`/repos/${owner}/${repo}/topics`),
  ]);

  const meta = repoMeta.status === 'fulfilled' ? repoMeta.value : null;
  if (!meta) throw new Error(`Repository ${owner}/${repo} not found or not accessible`);

  return {
    owner,
    repo,
    fullName: meta.full_name,
    description: meta.description || '',
    stars: meta.stargazers_count || 0,
    forks: meta.forks_count || 0,
    language: meta.language || '',
    languages: languages.status === 'fulfilled' ? languages.value : {},
    topics: topics.status === 'fulfilled' ? (topics.value.names || []) : (meta.topics || []),
    license: meta.license?.spdx_id || '',
    defaultBranch: meta.default_branch || 'main',
    homepage: meta.homepage || '',
    createdAt: meta.created_at,
    pushedAt: meta.pushed_at,
    readme: readme.status === 'fulfilled' ? (readme.value || '') : '',
    packageJson: (() => {
      if (packageJson.status !== 'fulfilled' || !packageJson.value) return null;
      try { return JSON.parse(packageJson.value); } catch { return null; }
    })(),
    openIssues: meta.open_issues_count || 0,
    watchers: meta.watchers_count || 0,
    size: meta.size || 0,
    hasWiki: meta.has_wiki,
    hasPages: meta.has_pages,
    subscribersCount: meta.subscribers_count || 0,
    networkCount: meta.network_count || 0,
  };
}
