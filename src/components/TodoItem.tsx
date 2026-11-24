import { useState } from 'react';
import type { Todo, Priority, Subject } from '../types/todo';
import { getDeadlineInfo } from '../utils/todoHelpers';
import { StarRating } from './StarRating';

interface TodoItemProps {
todo: Todo;
subjects: Subject[];
onToggle: (id: string) => void;
onUpdate: (
    id: string,
    title: string,
    subject: Subject,
    priority: Priority,
    dueDate: string
) => void;
onDelete: (id: string) => void;
}

const COLOR_PALETTE = [
{ bg: '#dbeafe', color: '#1d4ed8' },
{ bg: '#fce7f3', color: '#be185d' },
{ bg: '#fee2e2', color: '#b91c1c' },
{ bg: '#dcfce7', color: '#15803d' },
{ bg: '#fef3c7', color: '#b45309' },
{ bg: '#e0e7ff', color: '#4338ca' },
{ bg: '#f3e8ff', color: '#7e22ce' },
];

function getSubjectColor(subject: string) {
let hash = 0;
for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
}
return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
}

export function TodoItem({ todo, subjects, onToggle, onUpdate, onDelete }: TodoItemProps) {
const [isEditing, setIsEditing] = useState(false);
const [editText, setEditText] = useState(todo.title);
const [editSubject, setEditSubject] = useState<Subject>(todo.subject);
const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
const [editDueDate, setEditDueDate] = useState(todo.dueDate);

const startEditing = () => {
    setIsEditing(true);
    setEditText(todo.title);
    setEditSubject(todo.subject);
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate);
};

const saveEdit = () => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    onUpdate(todo.id, trimmed, editSubject, editPriority, editDueDate);
    setIsEditing(false);
};

const cancelEdit = () => {
    setIsEditing(false);
    setEditText(todo.title);
    setEditSubject(todo.subject);
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate);
};

const deadline = getDeadlineInfo(todo.dueDate, todo.completed);
const badgeColor = getSubjectColor(todo.subject);

const selectableSubjects = subjects.includes(todo.subject)
    ? subjects
    : [todo.subject, ...subjects];

return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
    {isEditing ? (
        <>
        <select
            className="select-field"
            value={editSubject}
            onChange={(e) => setEditSubject(e.target.value)}
        >
            {selectableSubjects.map((subj) => (
            <option key={subj} value={subj}>
                {subj}
            </option>
            ))}
        </select>
        <input
            type="text"
            className="input-field todo-form-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
        />
        <StarRating value={editPriority} onChange={setEditPriority} />
        <input
            type="date"
            className="input-field"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
        />
        <div className="todo-actions">
            <button type="button" className="btn btn-primary btn-sm" onClick={saveEdit}>
            保存
            </button>
            <button type="button" className="btn btn-sm" onClick={cancelEdit}>
            取消
            </button>
        </div>
        </>
    ) : (
        <>
        <input
            type="checkbox"
            className="todo-checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
        />

        <span
            className="subject-badge"
            style={{ backgroundColor: badgeColor.bg, color: badgeColor.color }}
        >
            {todo.subject}
        </span>

        <span
            className="todo-title"
            onDoubleClick={startEditing}
            title="ダブルクリックでも編集できます"
        >
            {todo.title}
        </span>

        <StarRating value={todo.priority} />

        {deadline && (
            <span className={`due-date ${deadline.status}`}>
            {deadline.label}
            </span>
        )}

        <div className="todo-actions">
            <button type="button" className="btn btn-sm" onClick={startEditing}>
            編集
            </button>
            <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(todo.id)}
            >
            削除
            </button>
        </div>
        </>
    )}
    </li>
);
}