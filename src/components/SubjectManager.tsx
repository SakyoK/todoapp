import { useState, type FormEvent } from 'react';
import type { Subject } from '../types/todo';

interface SubjectManagerProps {
subjects: Subject[];
onAddSubject: (newSubject: Subject) => void;
onDeleteSubject: (targetSubject: Subject) => void;
}

export function SubjectManager({
subjects,
onAddSubject,
onDeleteSubject,
}: SubjectManagerProps) {
const [isOpen, setIsOpen] = useState(false);
const [newSubject, setNewSubject] = useState('');

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = newSubject.trim();
    if (!trimmed) return;
    if (subjects.includes(trimmed)) {
    alert('同じ科目名がすでに存在します');
    return;
    }

    onAddSubject(trimmed);
    setNewSubject('');
};

return (
    <div className="subject-manager">
    <button
        type="button"
        className="btn btn-sm"
        onClick={() => setIsOpen((prev) => !prev)}
    >
        {isOpen ? '▲ 科目の編集を閉じる' : '⚙ 科目を追加・削除する'}
    </button>

    {isOpen && (
        <div className="subject-panel">
        <form onSubmit={handleSubmit} className="subject-add-form">
            <input
            type="text"
            className="input-field"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="新しい科目名（例：情報、プログラミング）"
            />
            <button type="submit" className="btn btn-primary">
            科目追加
            </button>
        </form>

        <div className="subject-tag-list">
            {subjects.map((subj) => (
            <span key={subj} className="subject-tag">
                {subj}
                {subjects.length > 1 && (
                <button
                    type="button"
                    className="subject-tag-remove"
                    onClick={() => onDeleteSubject(subj)}
                    title={`${subj}を削除`}
                >
                    ×
                </button>
                )}
            </span>
            ))}
        </div>
        </div>
    )}
    </div>
);
}