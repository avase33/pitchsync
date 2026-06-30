// Slide content builder -- 2026-06-30 11:19:53
import { RepoAnalysis } from './repoAnalyzer';

export interface Slide {
  id: string;
  title: string;
  type: 'cover' | 'problem' | 'solution' | 'tech' | 'traction' | 'team' | 'cta';
  content: string[];
  notes?: string;
}

export function buildDeck(analysis: RepoAnalysis): Slide[] {
  return [
    {
      id: 'cover',
      type: 'cover',
      title: analysis.name.charAt(0).toUpperCase() + analysis.name.slice(1),
      content: [analysis.description, analysis.techStack.slice(0, 3).join(' Â· ')],
      notes: 'Opening slide -- introduce the product name and one-liner.',
    },
    {
      id: 'problem',
      type: 'problem',
      title: 'The Problem',
      content: ['Developers waste hours on ' + (analysis.topics[0] ?? 'repetitive tasks'), 'Existing tools are complex and expensive', 'No unified solution exists today'],
      notes: 'Establish pain point clearly. Use numbers if available.',
    },
    {
      id: 'solution',
      type: 'solution',
      title: 'Our Solution',
      content: [analysis.description, 'Built with ' + analysis.techStack.slice(0, 4).join(', '), 'Open source with ' + analysis.stars + ' GitHub stars'],
      notes: 'Show the product demo or screenshot here.',
    },
    {
      id: 'tech',
      type: 'tech',
      title: 'Technology Stack',
      content: analysis.techStack.map(t => t.charAt(0).toUpperCase() + t.slice(1)),
      notes: 'Keep technical depth appropriate for audience.',
    },
    {
      id: 'traction',
      type: 'traction',
      title: 'Traction',
      content: [analysis.stars + ' GitHub Stars', analysis.forks + ' Forks', analysis.contributors + ' Contributors', analysis.openIssues + ' Open Issues'],
      notes: 'GitHub metrics as proxy for community traction.',
    },
    {
      id: 'cta',
      type: 'cta',
      title: 'Get Started',
      content: ['github.com/' + analysis.name, 'Star us on GitHub', 'Contribute and build with us'],
      notes: 'End with a clear call to action.',
    },
  ];
}