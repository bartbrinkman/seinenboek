import { useState } from 'react';
import type { Stats } from '../types';

interface Props {
  stats: Stats;
  onReset: () => void;
}

export default function ScoreBar({ stats, onReset }: Props) {
  const [confirming, setConfirming] = useState(false);
  const percentage = stats.total === 0 ? 0 : Math.round((stats.correct / stats.total) * 100);

  return (
    <div className="score-bar">
      <div className="score-bar__numbers">
        <span className="score-bar__fraction">
          {stats.correct} / {stats.total}
        </span>
        <span className="score-bar__percentage">{percentage}%</span>
      </div>

      {confirming ? (
        <div className="score-bar__confirm">
          <span>Score resetten?</span>
          <button
            type="button"
            className="btn btn--danger btn--small"
            onClick={() => {
              onReset();
              setConfirming(false);
            }}
          >
            Ja
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => setConfirming(false)}
          >
            Nee
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => setConfirming(true)}
          aria-label="Score resetten"
        >
          Reset
        </button>
      )}
    </div>
  );
}
