export type Priority = 1 | 2 | 3;
export type Subject = string;
export type Filter = 'all' | 'active' | 'completed';
export type SortBy = 'createdAt' | 'priority' | 'dueDate';

export const DEFAULT_SUBJECTS: Subject[] = ['数学', '英語', '国語', '理科', '社会', 'その他'];

export interface Todo {
id: string;
title: string;
subject: Subject;
completed: boolean;
priority: Priority;
dueDate: string;
createdAt: number;
}