// Repository analyzer -- 2026-06-22 13:08:29
import { Octokit } from '@octokit/rest';

export interface RepoAnalysis {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  openIssues: number;
  contributors: number;
  lastCommit: string;
  readme: string;
  techStack: string[];
}

export async function analyzeRepo(owner: string, repo: string, token?: string): Promise<RepoAnalysis> {
  const octokit = new Octokit({ auth: token });

  const [repoData, contributors, readme] = await Promise.all([
    octokit.repos.get({ owner, repo }),
    octokit.repos.listContributors({ owner, repo, per_page: 10 }),
    octokit.repos.getReadme({ owner, repo }).catch(() => null),
  ]);

  const r = repoData.data;
  const techStack = [...(r.topics ?? [])];
  if (r.language && !techStack.includes(r.language.toLowerCase())) techStack.unshift(r.language);

  const readmeContent = readme
    ? Buffer.from(readme.data.content, 'base64').toString('utf8').slice(0, 2000)
    : '';

  return {
    name: r.name,
    description: r.description ?? '',
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language ?? 'Unknown',
    topics: r.topics ?? [],
    openIssues: r.open_issues_count,
    contributors: contributors.data.length,
    lastCommit: r.pushed_at ?? '',
    readme: readmeContent,
    techStack,
  };
}