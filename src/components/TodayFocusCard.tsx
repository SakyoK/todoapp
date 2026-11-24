import type { Todo } from '../types/todo';
import { getDeadlineInfo, getTopPriorityTodos } from '../utils/todoHelpers';
import { StarRating } from './StarRating';

interface TodayFocusCardProps {
todos: Todo[];
onToggle: (id: string) => void;
}

export function TodayFocusCard({ todos, onToggle }: TodayFocusCardProps) {
const focusTodos = getTopPriorityTodos(todos, 3);

if (focusTodos.length === 0) {
    return null;
}

return (
    <section className="focus-card">
    <div className="focus-card-header">
        <span className="focus-card-title">🔥 今日優先すべきピックアップ（上位{focusTodos.length}件）</span>
        <span className="focus-card-sub">締切の近さと優先度から自動選出</span>
    </div>

    <ul className="focus-list">
        {focusTodos.map((todo) => {
        const deadline = getDeadlineInfo(todo.dueDate, todo.completed);
        return (
            <li key={todo.id} className="focus-item">
            <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />
            <span className="focus-subject">{todo.subject}</span>
            <span className="focus-title">{todo.title}</span>
            <StarRating value={todo.priority} />
            {deadline && (
                <span className={`due-date ${deadline.status}`}>
                {deadline.label}
                </span>
            )}
            </li>
        );
        })}
    </ul>
    </section>
);
}