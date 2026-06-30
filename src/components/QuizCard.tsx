import type { Question } from '../types';

interface Props {
  question: Question;
  selectedIndex: number | null;
  onAnswer: (index: number) => void;
  onNext: () => void;
}

export default function QuizCard({ question, selectedIndex, onAnswer, onNext }: Props) {
  const { signal, options, correctIndex } = question;
  const answered = selectedIndex !== null;

  function optionClass(index: number): string {
    if (!answered) return 'option';
    if (index === correctIndex) return 'option option--correct';
    if (index === selectedIndex) return 'option option--incorrect';
    return 'option option--disabled';
  }

  return (
    <div className="quiz-card">
      <div className="quiz-card__image-wrap">
        <img
          className="quiz-card__image"
          src={`${import.meta.env.BASE_URL}signals/${signal.images[0]}`}
          alt="Seinbeeld"
        />
      </div>

      <p className="quiz-card__prompt">Wat betekent dit sein?</p>

      <div className="quiz-card__options">
        {options.map((option, index) => (
          <button
            key={index}
            type="button"
            className={optionClass(index)}
            disabled={answered}
            onClick={() => onAnswer(index)}
          >
            {option}
          </button>
        ))}
      </div>

      {answered && (
        <div className="quiz-card__feedback">
          <p className="quiz-card__signal-label">
            {signal.label}
            {signal.sectionTitle && (
              <span className="quiz-card__section">
                {' '}
                — {signal.sectionTitle}
                {signal.subsectionTitle ? ` / ${signal.subsectionTitle}` : ''}
              </span>
            )}
          </p>
          <button type="button" className="btn btn--primary" onClick={onNext}>
            Volgende
          </button>
        </div>
      )}
    </div>
  );
}
