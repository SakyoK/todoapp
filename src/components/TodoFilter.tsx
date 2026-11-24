import type { Filter, SortBy, Subject } from '../types/todo';

interface TodoFilterProps {
subjects: Subject[];
filter: Filter;
subjectFilter: Subject | 'all';
sortBy: SortBy;
remainingCount: number;
onChangeFilter: (filter: Filter) => void;
onChangeSubjectFilter: (subject: Subject | 'all') => void;
onChangeSort: (sortBy: SortBy) => void;
}

export function TodoFilter({
subjects,
filter,
subjectFilter,
sortBy,
remainingCount,
onChangeFilter,
onChangeSubjectFilter,
onChangeSort,
}: TodoFilterProps) {
return (
    <div className="filter-bar">
    <div className="filter-tabs">
        {(['all', 'active', 'completed'] as const).map((f) => (
        <button
            key={f}
            type="button"
            onClick={() => onChangeFilter(f)}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
        >
            {f === 'all' ? 'すべて' : f === 'active' ? '未完了' : '完了済み'}
        </button>
        ))}
    </div>

    <div className="filter-controls">
        <select
        className="select-field"
        value={subjectFilter}
        onChange={(e) => onChangeSubjectFilter(e.target.value)}
        aria-label="科目絞り込み"
        >
        <option value="all">全科目</option>
        {subjects.map((subj) => (
            <option key={subj} value={subj}>
            {subj}
            </option>
        ))}
        </select>

        <select
        className="select-field"
        value={sortBy}
        onChange={(e) => onChangeSort(e.target.value as SortBy)}
        aria-label="並び替え"
        >
        <option value="createdAt">新しい順</option>
        <option value="priority">優先度順</option>
        <option value="dueDate">期限日順</option>
        </select>

        <span className="remaining-count">残り {remainingCount} 件</span>
    </div>
    </div>
);
}