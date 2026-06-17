/**
 * Converts structured analysis data into ordered pitch slides.
 */

export function generateSlides(analysis) {
  const slides = [
    // Slide 1: Title
    {
      type: 'title',
      order: 0,
      headline: analysis.name,
      subheadline: analysis.tagline,
      body: analysis.market,
      points: analysis.repoMeta.topics?.slice(0, 5) || [],
    },

    // Slide 2: Problem
    {
      type: 'problem',
      order: 1,
      headline: 'The Problem',
      subheadline: analysis.problem.text,
      body: '',
      points: analysis.problem.points,
      items: [],
    },

    // Slide 3: Solution
    {
      type: 'solution',
      order: 2,
      headline: `Introducing ${analysis.name}`,
      subheadline: analysis.solution.text,
      body: '',
      points: analysis.solution.points,
      items: [],
    },

    // Slide 4: How It Works
    {
      type: 'howItWorks',
      order: 3,
      headline: 'How It Works',
      subheadline: '',
      body: '',
      points: [],
      items: analysis.howItWorks.map((step, i) => ({ step: i + 1, text: step })),
    },

    // Slide 5: Tech Stack
    {
      type: 'techStack',
      order: 4,
      headline: 'Built With',
      subheadline: `Primary language: ${analysis.repoMeta.language || 'Multi-language'}`,
      body: '',
      points: [],
      items: analysis.techStack,
    },

    // Slide 6: Market
    {
      type: 'market',
      order: 5,
      headline: 'Market Opportunity',
      subheadline: `Target market: ${analysis.market}`,
      body: '',
      points: [
        'Developer tools market growing at 23% CAGR',
        'Remote-first teams driving demand for async-first platforms',
        'Open-source adoption accelerating in enterprise',
        'Bottom-up PLG motion — land developers, expand to teams',
      ],
      items: [],
    },

    // Slide 7: Traction
    {
      type: 'traction',
      order: 6,
      headline: 'Traction',
      subheadline: 'Real signal from the community',
      body: '',
      points: [],
      items: analysis.traction,
    },

    // Slide 8: Roadmap
    {
      type: 'roadmap',
      order: 7,
      headline: 'Roadmap',
      subheadline: 'Where we are going',
      body: '',
      points: [],
      items: analysis.roadmap,
    },

    // Slide 9: Team
    {
      type: 'team',
      order: 8,
      headline: 'The Team',
      subheadline: `Built by ${analysis.repoMeta.owner} and contributors`,
      body: 'Passionate builders with deep domain expertise.',
      points: [
        'Open-source community of contributors',
        `Active development since ${new Date(analysis.repoMeta.createdAt || Date.now()).getFullYear()}`,
        'Committed to shipping and iterating fast',
      ],
      items: [],
    },

    // Slide 10: Ask
    {
      type: 'ask',
      order: 9,
      headline: 'The Ask',
      subheadline: 'Join us in building the future',
      body: '',
      points: [
        'Product development and engineering',
        'Go-to-market and developer relations',
        'Infrastructure and scalability',
        'Community building and ecosystem growth',
      ],
      items: [
        { label: 'GitHub', url: `https://github.com/${analysis.repoMeta.fullName}` },
        { label: 'Homepage', url: analysis.repoMeta.homepage || '' },
      ].filter((l) => l.url),
    },
  ];

  return slides;
}
