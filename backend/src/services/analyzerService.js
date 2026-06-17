/**
 * Analyzes raw GitHub repo data and extracts structured pitch information.
 * No external AI API required — uses heuristics + README parsing.
 */

const PROBLEM_KEYWORDS = [
  'problem', 'challenge', 'pain', 'issue', 'struggle', 'difficulty',
  'frustrating', 'inefficient', 'costly', 'broken', 'hard to', 'difficult to',
  'existing solutions', 'current approach', 'the problem',
];

const SOLUTION_KEYWORDS = [
  'solution', 'introducing', 'we built', 'our approach', 'how it works',
  'the solution', 'solves', 'enables', 'allows', 'makes it easy',
  'built with', 'powered by',
];

const MARKET_KEYWORDS = [
  'market', 'industry', 'billion', 'million', 'tam', 'sam', 'som',
  'growing', 'opportunity', 'global', 'enterprise', 'startup', 'developer',
];

// Known tech frameworks/tools for categorization
const TECH_CATEGORIES = {
  'Frontend': ['react', 'vue', 'angular', 'svelte', 'next.js', 'nextjs', 'nuxt', 'gatsby', 'vite', 'tailwind', 'typescript', 'javascript'],
  'Backend': ['express', 'fastapi', 'django', 'flask', 'rails', 'spring', 'laravel', 'nest', 'nestjs', 'hapi', 'koa', 'gin', 'fiber', 'actix'],
  'Database': ['mongodb', 'postgresql', 'mysql', 'redis', 'sqlite', 'elasticsearch', 'cassandra', 'dynamodb', 'supabase', 'prisma', 'mongoose'],
  'Cloud': ['aws', 'gcp', 'azure', 'vercel', 'netlify', 'heroku', 'railway', 'render', 'fly.io', 'cloudflare'],
  'AI/ML': ['openai', 'langchain', 'tensorflow', 'pytorch', 'huggingface', 'llm', 'gpt', 'claude', 'anthropic', 'ollama'],
  'DevOps': ['docker', 'kubernetes', 'k8s', 'github actions', 'ci/cd', 'terraform', 'ansible', 'jenkins'],
  'Mobile': ['react native', 'flutter', 'expo', 'swift', 'kotlin', 'android', 'ios'],
};

function extractSections(readme) {
  if (!readme) return {};
  const sections = {};
  const lines = readme.split('\n');
  let currentSection = 'intro';
  let buffer = [];

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,3}\s+(.+)/);
    if (headingMatch) {
      if (buffer.length) sections[currentSection] = buffer.join('\n').trim();
      currentSection = headingMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '_');
      buffer = [];
    } else {
      buffer.push(line);
    }
  }
  if (buffer.length) sections[currentSection] = buffer.join('\n').trim();
  return sections;
}

function extractBulletPoints(text, maxPoints = 5) {
  if (!text) return [];
  return text
    .split('\n')
    .filter((l) => /^[-*+]\s+/.test(l.trim()))
    .map((l) => l.replace(/^[-*+]\s+/, '').replace(/\*\*/g, '').trim())
    .filter(Boolean)
    .slice(0, maxPoints);
}

function extractFirstParagraph(text) {
  if (!text) return '';
  const paras = text.split(/\n\n+/).filter((p) => p.trim() && !p.trim().startsWith('#'));
  return paras[0]?.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim() || '';
}

function detectTechStack(repoData) {
  const detected = {};
  const searchText = [
    repoData.readme,
    JSON.stringify(repoData.packageJson || {}),
    repoData.description,
    (repoData.topics || []).join(' '),
  ]
    .join(' ')
    .toLowerCase();

  for (const [category, tools] of Object.entries(TECH_CATEGORIES)) {
    const found = tools.filter((t) => searchText.includes(t.toLowerCase()));
    if (found.length) detected[category] = found.slice(0, 4);
  }

  // Also include top languages from GitHub
  const langs = Object.keys(repoData.languages || {});
  if (langs.length) {
    detected['Languages'] = langs.slice(0, 4);
  }

  return detected;
}

function buildTechStackItems(techMap) {
  return Object.entries(techMap).map(([category, tools]) => ({
    category,
    tools: tools.map((t) =>
      t
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    ),
  }));
}

function extractFeatures(sections, readme) {
  // Try features/capabilities section first
  const featureKeys = ['features', 'capabilities', 'what_it_does', 'highlights', 'key_features'];
  for (const key of featureKeys) {
    const bullets = extractBulletPoints(sections[key]);
    if (bullets.length >= 2) return bullets.slice(0, 6);
  }
  // Fall back to intro bullets
  return extractBulletPoints(sections['intro'] || readme || '', 6);
}

function inferMarketFromTopics(topics, description, language) {
  const text = [...(topics || []), description || '', language || ''].join(' ').toLowerCase();
  if (text.includes('enterprise') || text.includes('b2b')) return 'B2B Enterprise Software';
  if (text.includes('developer') || text.includes('devtools') || text.includes('cli')) return 'Developer Tools';
  if (text.includes('ai') || text.includes('ml') || text.includes('llm')) return 'AI & Machine Learning';
  if (text.includes('ecommerce') || text.includes('payment') || text.includes('fintech')) return 'FinTech / eCommerce';
  if (text.includes('health') || text.includes('medical')) return 'HealthTech';
  if (text.includes('education') || text.includes('learning')) return 'EdTech';
  if (text.includes('game') || text.includes('unity')) return 'Gaming';
  if (text.includes('security') || text.includes('auth')) return 'Cybersecurity';
  return 'Software & Technology';
}

export function analyzeRepo(repoData) {
  const sections = extractSections(repoData.readme);
  const techMap = detectTechStack(repoData);
  const features = extractFeatures(sections, repoData.readme);
  const market = inferMarketFromTopics(repoData.topics, repoData.description, repoData.language);

  // Problem statement
  const problemSection = sections['problem'] || sections['the_problem'] || sections['motivation'] || sections['background'] || '';
  const problemText = extractFirstParagraph(problemSection) ||
    `Developers and teams lack efficient tools in the ${market} space, leading to manual workflows, wasted time, and poor outcomes.`;
  const problemPoints = extractBulletPoints(problemSection, 4).length >= 2
    ? extractBulletPoints(problemSection, 4)
    : [
        'Existing tools are fragmented and require significant manual effort',
        'Teams waste valuable time on repetitive, low-value tasks',
        'No unified solution exists for this workflow',
        'Current approaches don\'t scale with team growth',
      ];

  // Solution statement
  const solutionSection = sections['solution'] || sections['the_solution'] || sections['overview'] || sections['intro'] || '';
  const solutionText = extractFirstParagraph(solutionSection) ||
    repoData.description ||
    `${repoData.repo} is an open-source platform that solves this problem with a modern, developer-first approach.`;

  // How it works steps
  const howSection = sections['how_it_works'] || sections['usage'] || sections['getting_started'] || sections['quick_start'] || '';
  const howBullets = extractBulletPoints(howSection, 4);
  const howSteps = howBullets.length >= 2
    ? howBullets
    : [
        `Connect your ${repoData.language || 'project'} repository or upload your files`,
        'Our engine analyzes structure, dependencies, and patterns automatically',
        'Get actionable results, reports, and generated assets in seconds',
        'Collaborate with your team and iterate with real-time feedback',
      ];

  // Roadmap
  const roadmapSection = sections['roadmap'] || sections['future'] || sections['upcoming'] || '';
  const roadmapItems = extractBulletPoints(roadmapSection, 6);
  const roadmapPhases = roadmapItems.length >= 2
    ? [
        { phase: 'Q1', label: 'Foundation', items: roadmapItems.slice(0, 2) },
        { phase: 'Q2', label: 'Growth', items: roadmapItems.slice(2, 4) },
        { phase: 'Q3+', label: 'Scale', items: roadmapItems.slice(4, 6).length ? roadmapItems.slice(4, 6) : ['Enterprise features', 'API marketplace'] },
      ]
    : [
        { phase: 'Q1', label: 'MVP', items: ['Core feature set', 'Public beta launch'] },
        { phase: 'Q2', label: 'Growth', items: ['Team collaboration', 'Integrations & API'] },
        { phase: 'Q3+', label: 'Scale', items: ['Enterprise tier', 'AI-powered features'] },
      ];

  // Traction metrics from GitHub data
  const traction = [
    { label: 'GitHub Stars', value: repoData.stars >= 1000 ? `${(repoData.stars / 1000).toFixed(1)}k` : String(repoData.stars), icon: 'star' },
    { label: 'Forks', value: String(repoData.forks), icon: 'fork' },
    { label: 'Topics', value: String((repoData.topics || []).length), icon: 'tag' },
    { label: 'Open Issues', value: String(repoData.openIssues || 0), icon: 'issue' },
  ].filter((m) => parseInt(m.value) > 0 || m.label === 'GitHub Stars');

  return {
    name: repoData.repo,
    fullName: repoData.fullName,
    tagline: repoData.description || `The modern solution for ${market.toLowerCase()}`,
    description: repoData.description,
    market,
    problem: { text: problemText, points: problemPoints },
    solution: {
      text: solutionText,
      points: features.length >= 3 ? features.slice(0, 4) : [
        'Simple, intuitive interface that teams adopt immediately',
        'Powerful automation that eliminates manual work',
        'Open-source foundation with enterprise-grade reliability',
        'Seamless integration with existing workflows',
      ],
    },
    howItWorks: howSteps,
    techStack: buildTechStackItems(techMap),
    traction,
    roadmap: roadmapPhases,
    repoMeta: {
      owner: repoData.owner,
      repo: repoData.repo,
      fullName: repoData.fullName,
      description: repoData.description,
      stars: repoData.stars,
      forks: repoData.forks,
      language: repoData.language,
      languages: repoData.languages,
      topics: repoData.topics,
      license: repoData.license,
      defaultBranch: repoData.defaultBranch,
      homepage: repoData.homepage,
      createdAt: repoData.createdAt,
      pushedAt: repoData.pushedAt,
    },
  };
}
