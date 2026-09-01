import { FORM_MODES, STATUSES } from '@/components/TaskBoard';

export type Status = (typeof STATUSES)[number];

export type FormMode = (typeof FORM_MODES)[number];

export interface Task {
    id: string;
    desc: string;
    status: Status;
    createdAt: string;
}
