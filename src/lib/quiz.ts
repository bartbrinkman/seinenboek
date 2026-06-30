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

// Some official signal meanings are near word-for-word paraphrases of each
// other (e.g. "Toestemming voor het starten van de vertrekprocedure." vs
// "Er is toestemming voor het starten van de vertrekprocedure."), or differ
// by a single negation ("Er nadert een trein." vs "Er nadert geen trein.").
// Putting two of those in the same question makes it unanswerable rather
// than a fair "likely misdirect", so distractors are filtered out if they
// read too close to an option already in play.
const TOO_SIMILAR = 0.75;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function bigrams(text: string): Set<string> {
  const normalized = normalize(text);
  const result = new Set<string>();
  for (let i = 0; i < normalized.length - 1; i++) {
    result.add(normalized.slice(i, i + 2));
  }
  return result;
}

// Sørensen-Dice coefficient over character bigrams: robust to small wording
// changes, cheap enough to run per-candidate against a ~190-entry pool.
function similarity(a: string, b: string): number {
  const setA = bigrams(a);
  const setB = bigrams(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let shared = 0;
  for (const gram of setA) {
    if (setB.has(gram)) shared++;
  }
  return (2 * shared) / (setA.size + setB.size);
}

function tooSimilarToAny(meaning: string, others: string[]): boolean {
  return others.some((other) => similarity(meaning, other) >= TOO_SIMILAR);
}

function pickDistractors(correct: Signal, count: number): string[] {
  const distractors: string[] = [];

  const tiers = [
    ALL_SIGNALS.filter(
      (s) => s.id !== correct.id && correct.subsection && s.subsection === correct.subsection,
    ),
    ALL_SIGNALS.filter((s) => s.id !== correct.id && s.section === correct.section),
    ALL_SIGNALS.filter((s) => s.id !== correct.id),
  ];

  // First pass: respect the similarity guard. Second pass (only reached if
  // the pool is too small/repetitive) fills any remaining slots without it,
  // so a question is never short an option.
  for (const strict of [true, false]) {
    for (const tier of tiers) {
      if (distractors.length >= count) break;
      for (const signal of shuffle(tier)) {
        if (distractors.length >= count) break;
        if (distractors.includes(signal.meaning)) continue;
        const chosen = [correct.meaning, ...distractors];
        if (strict && tooSimilarToAny(signal.meaning, chosen)) continue;
        distractors.push(signal.meaning);
      }
    }
    if (distractors.length >= count) break;
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
