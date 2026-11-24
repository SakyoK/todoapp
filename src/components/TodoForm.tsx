import { useState, useEffect, type FormEvent } from 'react';
import type { Priority, Subject } from '../types/todo';
import { StarRating } from './StarRating';

interface TodoFormProps {
subjects: Subject[];
onAdd: (title: string, subject: Subject, priority: Priority, dueDate: string) => void;
}

export function TodoForm({ subjects, onAdd }: TodoFormProps) {
const [inputText, setInputText] = useState('');
const [subject, setSubject] = useState<Subject>(subjects[0] ?? 'その他');
const [priority, setPriority] = useState<Priority>(2);
const [dueDate, setDueDate] = useState('');

useEffect(() => {
    if (!subjects.includes(subject) && subjects.length > 0) {
    setSubject(subjects[0]);
    }
}, [subjects, subject]);

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    onAdd(trimmed, subject, priority, dueDate);
    setInputText('');
    setPriority(2);
    setDueDate('');
};

return (
    <form onSubmit={handleSubmit} className="todo-form">
    <select
        className="select-field"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        aria-label="科目"
    >
        {subjects.map((subj) => (
        <option key={subj} value={subj}>
            {subj}
        </option>
        ))}
    </select>

    <input
        type="text"
        className="input-field todo-form-input"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="課題内容を入力（例：ワーク p.12〜15）"
    />

    <div className="priority-box">
        <span className="priority-label">優先度:</span>
        <StarRating value={priority} onChange={setPriority} />
    </div>

    <input
        type="date"
        className="input-field"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        aria-label="期限日"
    />

    <button type="submit" className="btn btn-primary">
        追加
    </button>
    </form>
);
}