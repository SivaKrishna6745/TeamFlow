import { PRIORITIES, STATUSES } from '../constants';
import type { Priority, Status } from '../types';

export const validateTask = (task: unknown): string | null => {
    if (typeof task !== 'object' || task === null) {
        return 'Invalid task data';
    }

    const data = task as Record<string, unknown>;
    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
        return 'Title is required and must be a string';
    }
    if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
        return 'Description is required and must be a string';
    }
    if (typeof data.status !== 'string') {
        return 'Status is required and must be a string';
    }
    if (!STATUSES.includes(data.status as Status)) {
        return 'Invalid status';
    }
    if (typeof data.priority !== 'string') {
        return 'Priority is required and must be a string';
    }
    if (!PRIORITIES.includes(data.priority as Priority)) {
        return 'Invalid priority';
    }
    if (data.assignee === null || typeof data.assignee !== 'object') {
        return 'Assignee is required and must be an object';
    }
    const assignee = data.assignee as Record<string, unknown>;
    if (typeof assignee.userId !== 'string' || assignee.userId.trim() === '') {
        return 'Assignee must have a userId and must be a string and required';
    }
    if (typeof assignee.name !== 'string' || assignee.name.trim() === '') {
        return 'Assignee must have a name and must be a string and required';
    }
    if (data.dueDate !== undefined && data.dueDate !== null && typeof data.dueDate !== 'string') {
        return 'Due Date must be a string';
    }

    return null;
};
