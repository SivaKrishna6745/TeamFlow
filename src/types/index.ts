import { FILTERS } from '@/components/Filters';
import { FORM_MODES, SORT_OPTIONS, STATUSES, PRIORITIES } from '@/constants';

export type Status = (typeof STATUSES)[number];

export type FormMode = (typeof FORM_MODES)[number];

export type Filter = (typeof FILTERS)[number];

export type SortOptions = (typeof SORT_OPTIONS)[number];

export type User = { userId: string; name: string };

export type Priority = (typeof PRIORITIES)[number];

export interface Task {
    id: string;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    createdAt: string;
    assignee: User;
    dueDate?: string;
}
