import { useEffect, useState } from 'react';
import './App.css';
import ScoreBar from './components/ScoreBar';
import QuizCard from './components/QuizCard';
import { nextQuestion } from './lib/quiz';
import { loadStats, resetStats, saveStats } from './lib/storage';
import type { Question, Stats } from './types';

export default function App() {
  const [stats, setStats] = useState<Stats>(() => loadStats());
  const [question, setQuestion] = useState<Question>(() => nextQuestion());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  function handleAnswer(index: number) {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    const correct = index === question.correctIndex;
    setStats((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  }

  function handleNext() {
    setQuestion(nextQuestion());
    setSelectedIndex(null);
  }

  function handleReset() {
    setStats(resetStats());
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Seinenboek</h1>
        <ScoreBar stats={stats} onReset={handleReset} />
      </header>

      <main className="app__main">
        <QuizCard
          question={question}
          selectedIndex={selectedIndex}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      </main>
    </div>
  );
}
