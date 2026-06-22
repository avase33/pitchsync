/**
 * PitchSync -- Slide Content Builder
 */

export interface RepoAnalysis {
  name: string;
  description: string;
  language: string;
  topics: string[];
  stars: number;
  commits: number;
  contributors: number;
  hasTests: boolean;
  hasDocker: boolean;
  hasCI: boolean;
  techStack: string[];
}

export interface Slide {
  id: string;
  title: string;
  content: string[];
  notes: string;
  layout: 'title' | 'bullets' | 'two-col' | 'metric' | 'quote';
}

export function buildCoverSlide(repo: RepoAnalysis): Slide {
  return {
    id: 'cover',
    title: repo.name.toUpperCase(),
    content: [repo.description || 'Developer tool for modern engineering teams', 'Built with ' + repo.techStack.slice(0, 3).join(' Â· ')],
    notes: 'Opening slide. Presenter introduces themselves and the project.',
    layout: 'title',
  };
}

export function buildTractionSlide(repo: RepoAnalysis): Slide {
  const signals: string[] = [];
  if (repo.commits > 0) signals.push(repo.commits + '+ commits');
  if (repo.contributors > 1) signals.push(repo.contributors + ' contributors');
  if (repo.hasTests) signals.push('Full test coverage');
  if (repo.hasCI) signals.push('CI/CD pipeline');
  if (repo.hasDocker) signals.push('Docker-ready');
  return {
    id: 'traction',
    title: 'Traction and Execution Signal',
    content: signals.length > 0 ? signals : ['Active development', 'Production-ready codebase'],
    notes: 'Highlight engineering execution quality as a proxy for team velocity.',
    layout: 'metric',
  };
}

export function buildDeck(repo: RepoAnalysis): Slide[] {
  return [
    buildCoverSlide(repo),
    { id: 'problem', title: 'The Problem', content: ['Market gap extracted from repository analysis'], notes: 'Keep to one sentence.', layout: 'quote' },
    { id: 'solution', title: 'Our Solution', content: [repo.description || 'Powerful developer-first tooling'], notes: 'Demo the core feature.', layout: 'bullets' },
    buildTractionSlide(repo),
    { id: 'ask', title: 'The Ask', content: ['[Round size -- edit before presenting]'], notes: 'Customize before each pitch.', layout: 'metric' },
  ];
}