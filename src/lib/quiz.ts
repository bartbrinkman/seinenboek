import signalData from '../data/signals.json';
import type { Question, Signal, SignalData } from '../types';

const data = signalData as SignalData;
export const ALL_SIGNALS: Signal[] = data.signals;

// Sections 2 (Lichtseinen), 3 (Snelheidsborden) and 7 (Stopopdrachten) are the
// most iconic "seinbeelden", so they show up roughly twice as often as the rest.
const WEIGHTED_SECTIONS = new Set(['2', '3', '7']);
const WEIGHT_BOOST = 2;
const OPTIONS_PER_QUESTION = 3;

function weightOf(signal: Signal): number {
  return WEIGHTED_SECTIONS.has(signal.section) ? WEIGHT_BOOST : 1;
}

function pickWeighted(pool: Signal[]): Signal {
  const total = pool.reduce((sum, s) => sum + weightOf(s), 0);
  let roll = Math.random() * total;
  for (const signal of pool) {
    roll -= weightOf(signal);
    if (roll <= 0) return signal;
  }
  return pool[pool.length - 1];
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickDistractors(correct: Signal, count: number): string[] {
  const seenMeanings = new Set([correct.meaning]);
  const distractors: string[] = [];

  const tiers = [
    ALL_SIGNALS.filter(
      (s) => s.id !== correct.id && correct.subsection && s.subsection === correct.subsection,
    ),
    ALL_SIGNALS.filter((s) => s.id !== correct.id && s.section === correct.section),
    ALL_SIGNALS.filter((s) => s.id !== correct.id),
  ];

  for (const tier of tiers) {
    if (distractors.length >= count) break;
    for (const signal of shuffle(tier)) {
      if (distractors.length >= count) break;
      if (seenMeanings.has(signal.meaning)) continue;
      seenMeanings.add(signal.meaning);
      distractors.push(signal.meaning);
    }
  }

  return distractors;
}

let lastSignalId: string | null = null;

export function nextQuestion(): Question {
  let signal = pickWeighted(ALL_SIGNALS);
  if (signal.id === lastSignalId && ALL_SIGNALS.length > 1) {
    signal = pickWeighted(ALL_SIGNALS);
  }
  lastSignalId = signal.id;

  const distractors = pickDistractors(signal, OPTIONS_PER_QUESTION - 1);
  const options = shuffle([signal.meaning, ...distractors]);
  const correctIndex = options.indexOf(signal.meaning);

  return { signal, options, correctIndex };
}
