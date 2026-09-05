import { FILTERS } from '@/components/Filters';
import { FORM_MODES, STATUSES } from '@/components/TaskBoard';

export type Status = (typeof STATUSES)[number];

export type FormMode = (typeof FORM_MODES)[number];

export type Filter = (typeof FILTERS)[number];

export type User = { userId: string; name: string };

export interface Task {
    id: string;
    title: string;
    description: string;
    status: Status;
    createdAt: string;
    assignee: User;
}
