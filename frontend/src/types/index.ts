export interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  githubUsername: string;
  pitchCount: number;
  initials: string;
  createdAt: string;
}

export type SlideType =
  | 'title'
  | 'problem'
  | 'solution'
  | 'howItWorks'
  | 'techStack'
  | 'market'
  | 'traction'
  | 'roadmap'
  | 'team'
  | 'ask';

export type PitchTheme = 'dark' | 'light' | 'ocean' | 'forest' | 'sunset';
export type PitchStatus = 'generating' | 'ready' | 'error';

export interface Slide {
  type: SlideType;
  order: number;
  headline?: string;
  subheadline?: string;
  body?: string;
  points?: string[];
  items?: unknown[];
}

export interface RepoMeta {
  owner: string;
  repo: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  languages: Record<string, number>;
  topics: string[];
  license: string;
  homepage: string;
  createdAt: string;
  pushedAt: string;
}

export interface Pitch {
  _id: string;
  owner: User | string;
  title: string;
  tagline: string;
  repoUrl: string;
  repoMeta?: RepoMeta;
  slides: Slide[];
  theme: PitchTheme;
  isPublic: boolean;
  views: number;
  likes: number;
  status: PitchStatus;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items?: T[];
  pitches?: T[];
  total: number;
  page: number;
  pages: number;
}

export type TechItem = { category: string; tools: string[] };
export type TractionItem = { label: string; value: string; icon: string };
export type RoadmapPhase = { phase: string; label: string; items: string[] };
export type StepItem = { step: number; text: string };
export type LinkItem = { label: string; url: string };
