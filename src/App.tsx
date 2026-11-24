import { useState } from 'react';
import {
  DEFAULT_SUBJECTS,
  type Todo,
  type Filter,
  type Priority,
  type SortBy,
  type Subject,
} from './types/todo';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ProgressDashboard } from './components/ProgressDashboard';
import { TodayFocusCard } from './components/TodayFocusCard';
import { SubjectManager } from './components/SubjectManager';
import { TodoForm } from './components/TodoForm';
import { TodoFilter } from './components/TodoFilter';
import { TodoItem } from './components/TodoItem';
import './App.css';

export function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('study-todo-items-v1', []);
  const [subjects, setSubjects] = useLocalStorage<Subject[]>(
    'study-todo-subjects-v1',
    DEFAULT_SUBJECTS
  );

  const [filter, setFilter] = useState<Filter>('all');
  const [subjectFilter, setSubjectFilter] = useState<Subject | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');

  const handleAddSubject = (newSubject: Subject) => {
    setSubjects((prev) => [...prev, newSubject]);
  };

  const handleDeleteSubject = (targetSubject: Subject) => {
    setSubjects((prev) => prev.filter((s) => s !== targetSubject));
    if (subjectFilter === targetSubject) {
      setSubjectFilter('all');
    }
  };

  const handleAdd = (
    title: string,
    subject: Subject,
    priority: Priority,
    dueDate: string
  ) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      subject,
      completed: false,
      priority,
      dueDate,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleUpdate = (
    id: string,
    title: string,
    subject: Subject,
    priority: Priority,
    dueDate: string
  ) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, title, subject, priority, dueDate } : todo
      )
    );
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const visibleTodos = todos
    .filter((todo) => {
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;
      if (subjectFilter !== 'all' && todo.subject !== subjectFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        return b.priority - a.priority;
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return b.createdAt - a.createdAt;
    });

  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <main className="app-container">
      <h1 className="app-title">課題管理 Todo App</h1>

      <ProgressDashboard todos={todos} subjects={subjects} />

      <TodayFocusCard todos={todos} onToggle={handleToggle} />

      <SubjectManager
        subjects={subjects}
        onAddSubject={handleAddSubject}
        onDeleteSubject={handleDeleteSubject}
      />

      <TodoForm subjects={subjects} onAdd={handleAdd} />

      <TodoFilter
        subjects={subjects}
        filter={filter}
        subjectFilter={subjectFilter}
        sortBy={sortBy}
        remainingCount={remainingCount}
        onChangeFilter={setFilter}
        onChangeSubjectFilter={setSubjectFilter}
        onChangeSort={setSortBy}
      />

      <ul className="todo-list">
        {visibleTodos.length === 0 ? (
          <li className="empty-state">表示する課題はありません</li>
        ) : (
          visibleTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              subjects={subjects}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </ul>
    </main>
  );
}

export default App;