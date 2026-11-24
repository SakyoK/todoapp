import type { Todo, Subject } from '../types/todo';

interface ProgressDashboardProps {
todos: Todo[];
subjects: Subject[];
}

export function ProgressDashboard({ todos, subjects }: ProgressDashboardProps) {
const totalCount = todos.length;
const completedCount = todos.filter((t) => t.completed).length;
  const overallRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

const activeSubjects = Array.from(new Set([...subjects, ...todos.map((t) => t.subject)]));

const subjectStats = activeSubjects
    .map((subject) => {
    const subjectTodos = todos.filter((t) => t.subject === subject);
    const total = subjectTodos.length;
    const completed = subjectTodos.filter((t) => t.completed).length;
      const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { subject, total, completed, rate };
    })
    .filter((stat) => stat.total > 0);

    return (
    <section className="dashboard">
        <div>
        <div className="dashboard-overall-header">
            <span className="dashboard-title">全体の達成率</span>
            <span className="dashboard-stats">
            {completedCount} / {totalCount} 件完了（<strong>{overallRate}%</strong>）
            </span>
        </div>

        <div className="progress-track">
            <div
            className={`progress-fill ${overallRate === 100 && totalCount > 0 ? 'complete' : ''}`}
            style={{ width: `${overallRate}%` }}
            />
        </div>
        </div>

        {subjectStats.length > 0 && (
        <div className="subject-grid">
            {subjectStats.map(({ subject, total, completed, rate }) => (
            <div key={subject} className="subject-card">
                <div className="subject-card-header">
                <span className="subject-card-name">{subject}</span>
                <span className="subject-card-count">
                    {completed}/{total} ({rate}%)
                </span>
                </div>

                <div className="progress-track progress-track-sm">
                <div
                    className={`progress-fill ${rate === 100 ? 'complete' : ''}`}
                    style={{ width: `${rate}%` }}
                />
                </div>
            </div>
            ))}
        </div>
        )}
    </section>
    );
}