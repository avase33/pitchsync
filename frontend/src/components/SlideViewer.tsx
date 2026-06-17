import type { Slide, PitchTheme, TechItem, TractionItem, RoadmapPhase, StepItem, LinkItem } from '../types';
import { Star, GitFork, ExternalLink, CheckCircle, ArrowRight } from 'lucide-react';

const THEME_CLASS: Record<PitchTheme, string> = {
  dark: 'bg-gray-950 text-white',
  ocean: 'bg-gradient-to-br from-blue-950 via-cyan-950 to-blue-950 text-white',
  forest: 'bg-gradient-to-br from-green-950 via-emerald-950 to-teal-950 text-white',
  sunset: 'bg-gradient-to-br from-orange-950 via-red-950 to-pink-950 text-white',
  light: 'bg-white text-gray-900',
};

const ACCENT: Record<PitchTheme, string> = {
  dark: 'text-blue-400',
  ocean: 'text-cyan-400',
  forest: 'text-emerald-400',
  sunset: 'text-orange-400',
  light: 'text-blue-600',
};

const ACCENT_BG: Record<PitchTheme, string> = {
  dark: 'bg-blue-600/20 border-blue-500/30',
  ocean: 'bg-cyan-600/20 border-cyan-500/30',
  forest: 'bg-emerald-600/20 border-emerald-500/30',
  sunset: 'bg-orange-600/20 border-orange-500/30',
  light: 'bg-blue-50 border-blue-200',
};

function SlideTitle({ slide, theme }: { slide: Slide; theme: PitchTheme }) {
  const topics = (slide.points || []) as string[];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-6 px-16">
      <div className={`text-5xl font-black tracking-tight ${ACCENT[theme]}`}>{slide.headline}</div>
      <div className="text-xl text-gray-300 max-w-2xl leading-relaxed">{slide.subheadline}</div>
      {slide.body && (
        <div className={`text-sm font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border ${ACCENT_BG[theme]} ${ACCENT[theme]}`}>
          {slide.body}
        </div>
      )}
      {topics.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {topics.map((t, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-300 border border-white/10">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function SlideBullets({ slide, theme }: { slide: Slide; theme: PitchTheme }) {
  const points = slide.points || [];
  return (
    <div className="flex flex-col justify-center h-full gap-6 px-16">
      <div>
        <div className={`text-3xl font-black mb-2 ${ACCENT[theme]}`}>{slide.headline}</div>
        {slide.subheadline && <div className="text-gray-300 text-base max-w-xl leading-relaxed">{slide.subheadline}</div>}
      </div>
      <ul className="space-y-4">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle size={18} className={`mt-0.5 flex-shrink-0 ${ACCENT[theme]}`} />
            <span className="text-gray-200 text-base leading-relaxed">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SlideSteps({ slide, theme }: { slide: Slide; theme: PitchTheme }) {
  const steps = (slide.items || []) as StepItem[];
  return (
    <div className="flex flex-col justify-center h-full gap-6 px-16">
      <div className={`text-3xl font-black ${ACCENT[theme]}`}>{slide.headline}</div>
      <div className="grid grid-cols-2 gap-4">
        {steps.map((s, i) => (
          <div key={i} className={`rounded-xl border p-5 ${ACCENT_BG[theme]}`}>
            <div className={`text-2xl font-black mb-2 ${ACCENT[theme]}`}>{s.step}</div>
            <div className="text-gray-200 text-sm leading-relaxed">{s.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideTechStack({ slide, theme }: { slide: Slide; theme: PitchTheme }) {
  const items = (slide.items || []) as TechItem[];
  return (
    <div className="flex flex-col justify-center h-full gap-6 px-16">
      <div>
        <div className={`text-3xl font-black mb-1 ${ACCENT[theme]}`}>{slide.headline}</div>
        {slide.subheadline && <div className="text-gray-400 text-sm">{slide.subheadline}</div>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {items.map((cat, i) => (
          <div key={i} className={`rounded-xl border p-4 ${ACCENT_BG[theme]}`}>
            <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${ACCENT[theme]}`}>{cat.category}</div>
            <div className="flex flex-wrap gap-2">
              {cat.tools.map((t, j) => (
                <span key={j} className="px-2 py-0.5 rounded bg-white/10 text-gray-300 text-xs border border-white/10">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideTraction({ slide, theme }: { slide: Slide; theme: PitchTheme }) {
  const metrics = (slide.items || []) as TractionItem[];
  return (
    <div className="flex flex-col justify-center h-full gap-6 px-16">
      <div>
        <div className={`text-3xl font-black mb-1 ${ACCENT[theme]}`}>{slide.headline}</div>
        <div className="text-gray-400 text-sm">{slide.subheadline}</div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className={`rounded-xl border p-6 text-center ${ACCENT_BG[theme]}`}>
            <div className={`text-4xl font-black mb-1 ${ACCENT[theme]}`}>{m.value}</div>
            <div className="text-gray-400 text-sm">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideRoadmap({ slide, theme }: { slide: Slide; theme: PitchTheme }) {
  const phases = (slide.items || []) as RoadmapPhase[];
  return (
    <div className="flex flex-col justify-center h-full gap-6 px-16">
      <div className={`text-3xl font-black ${ACCENT[theme]}`}>{slide.headline}</div>
      <div className="flex gap-4">
        {phases.map((ph, i) => (
          <div key={i} className="flex-1">
            <div className={`rounded-xl border p-5 h-full ${ACCENT_BG[theme]}`}>
              <div className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${ACCENT[theme]}`}>{ph.phase}</div>
              <div className="text-white font-semibold mb-3">{ph.label}</div>
              <ul className="space-y-2">
                {(ph.items || []).map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                    <ArrowRight size={14} className={`mt-0.5 flex-shrink-0 ${ACCENT[theme]}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideAsk({ slide, theme }: { slide: Slide; theme: PitchTheme }) {
  const links = (slide.items || []) as LinkItem[];
  return (
    <div className="flex flex-col justify-center h-full gap-6 px-16">
      <div>
        <div className={`text-3xl font-black mb-1 ${ACCENT[theme]}`}>{slide.headline}</div>
        <div className="text-gray-300 text-base">{slide.subheadline}</div>
      </div>
      {(slide.points || []).length > 0 && (
        <div>
          <div className="text-sm text-gray-400 font-semibold mb-3 uppercase tracking-wider">Use of funds</div>
          <ul className="grid grid-cols-2 gap-3">
            {(slide.points || []).map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-200 text-sm">
                <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${ACCENT[theme].replace('text-', 'bg-')}`} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
      {links.length > 0 && (
        <div className="flex gap-3">
          {links.map((l, i) => (
            <a
              key={i}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors hover:opacity-80 ${ACCENT_BG[theme]} ${ACCENT[theme]}`}
            >
              <ExternalLink size={14} />
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function renderSlide(slide: Slide, theme: PitchTheme) {
  switch (slide.type) {
    case 'title': return <SlideTitle slide={slide} theme={theme} />;
    case 'problem': return <SlideBullets slide={slide} theme={theme} />;
    case 'solution': return <SlideBullets slide={slide} theme={theme} />;
    case 'howItWorks': return <SlideSteps slide={slide} theme={theme} />;
    case 'techStack': return <SlideTechStack slide={slide} theme={theme} />;
    case 'market': return <SlideBullets slide={slide} theme={theme} />;
    case 'traction': return <SlideTraction slide={slide} theme={theme} />;
    case 'roadmap': return <SlideRoadmap slide={slide} theme={theme} />;
    case 'team': return <SlideBullets slide={slide} theme={theme} />;
    case 'ask': return <SlideAsk slide={slide} theme={theme} />;
    default: return null;
  }
}

interface SlideViewerProps {
  slide: Slide;
  theme: PitchTheme;
  index: number;
  total: number;
}

export default function SlideViewer({ slide, theme, index, total }: SlideViewerProps) {
  return (
    <div className={`relative w-full aspect-video rounded-xl overflow-hidden ${THEME_CLASS[theme]} shadow-2xl`}>
      {renderSlide(slide, theme)}
      {/* Slide number */}
      <div className="absolute bottom-4 right-4 text-xs text-white/30 font-mono">
        {index + 1} / {total}
      </div>
    </div>
  );
}
