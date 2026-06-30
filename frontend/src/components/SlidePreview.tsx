// SlidePreview component -- 2026-06-30 12:05:29
import { useState } from 'react';

interface Slide { id: string; type: string; title: string; content: string[]; notes?: string; }
interface Props { slides: Slide[]; }

const slideThemes: Record<string, string> = {
  cover: 'bg-indigo-900 text-white',
  problem: 'bg-red-900 text-white',
  solution: 'bg-green-900 text-white',
  tech: 'bg-blue-900 text-white',
  traction: 'bg-purple-900 text-white',
  cta: 'bg-indigo-700 text-white',
};

export default function SlidePreview({ slides }: Props) {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  if (!slide) return null;

  return (
    <div className='flex flex-col h-full'>
      <div className={lex-1 rounded-xl p-10 flex flex-col justify-center }>
        <p className='text-xs uppercase tracking-widest opacity-60 mb-4'>{slide.type} -- {current + 1}/{slides.length}</p>
        <h2 className='text-4xl font-bold mb-8'>{slide.title}</h2>
        <ul className='space-y-3'>
          {slide.content.map((line, i) => (
            <li key={i} className='text-xl opacity-90'>{line}</li>
          ))}
        </ul>
      </div>
      <div className='flex gap-2 mt-4 justify-center'>
        <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0} className='px-4 py-2 bg-gray-200 rounded disabled:opacity-30'>Prev</button>
        <button onClick={() => setCurrent(c => Math.min(slides.length - 1, c + 1))} disabled={current === slides.length - 1} className='px-4 py-2 bg-gray-200 rounded disabled:opacity-30'>Next</button>
      </div>
    </div>
  );
}