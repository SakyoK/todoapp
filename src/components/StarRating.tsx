import type { Priority } from '../types/todo';

interface StarRatingProps {
value: Priority;
onChange?: (value: Priority) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
const stars: Priority[] = [1, 2, 3];

return (
    <span className="star-rating" aria-label={`優先度 ${value}`}>
    {stars.map((star) => {
        const active = star <= value;
        return (
        <button
            key={star}
            type="button"
            disabled={!onChange}
            onClick={() => onChange?.(star)}
            title={`優先度: ${star}`}
            className={`star-btn ${active ? 'active' : ''} ${onChange ? 'interactive' : ''}`}
        >
            {active ? '★' : '☆'}
        </button>
        );
    })}
    </span>
);
}