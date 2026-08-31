import { STATUSES } from '@/components/TaskBoard';

export type Status = (typeof STATUSES)[number];

export interface Task {
    id: string;
    desc: string;
    status: Status;
    createdAt: string;
}
