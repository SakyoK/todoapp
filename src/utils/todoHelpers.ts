import type { Todo } from '../types/todo';

export interface DeadlineInfo {
  label: string;
  status: 'overdue' | 'today' | 'soon' | 'normal';
  diffDays: number;
}

// 'YYYY-MM-DD' と今日の日付の差を計算してバッジ用情報を返す
export function getDeadlineInfo(dueDate: string, completed: boolean): DeadlineInfo | null {
  if (!dueDate) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [year, month, day] = dueDate.split('-').map(Number);
  const target = new Date(year, month - 1, day);

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (completed) {
    return { label: dueDate, status: 'normal', diffDays };
  }
  if (diffDays < 0) {
    return { label: `${Math.abs(diffDays)}日超過 (${dueDate})`, status: 'overdue', diffDays };
  }
  if (diffDays === 0) {
    return { label: '今日まで！', status: 'today', diffDays };
  }
  if (diffDays === 1) {
    return { label: '明日まで (あと1日)', status: 'soon', diffDays };
  }
  if (diffDays <= 3) {
    return { label: `あと${diffDays}日 (${dueDate})`, status: 'soon', diffDays };
  }
  return { label: `あと${diffDays}日 (${dueDate})`, status: 'normal', diffDays };
}

// 未完了タスクから「今日優先すべき最大3件」を自動抽出する
export function getTopPriorityTodos(todos: Todo[], limit = 3): Todo[] {
  const activeTodos = todos.filter((todo) => !todo.completed);

  return [...activeTodos]
    .sort((a, b) => {
      const aInfo = getDeadlineInfo(a.dueDate, false);
      const bInfo = getDeadlineInfo(b.dueDate, false);

      // 期限ありを優先、さらに締切が近い順（ただし4日以上先のタスクは優先度（星）を重視）
      const aUrgent = aInfo !== null && aInfo.diffDays <= 3;
      const bUrgent = bInfo !== null && bInfo.diffDays <= 3;

      if (aUrgent && !bUrgent) return -1;
      if (!aUrgent && bUrgent) return 1;

      if (aUrgent && bUrgent && aInfo && bInfo && aInfo.diffDays !== bInfo.diffDays) {
        return aInfo.diffDays - bInfo.diffDays;
      }

      // 緊急度が同じ場合は星の数（優先度）が高い順
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }

      // それでも同じなら期限が設定されている方を優先
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);

      return b.createdAt - a.createdAt;
    })
    .slice(0, limit);
}