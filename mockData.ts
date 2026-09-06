import { Task, User } from '@/types';

export const tasksData: Task[] = [
    {
        id: '1',
        title: 'Task 1',
        description: 'Description for Task 1',
        status: 'Todo',
        createdAt: '',
        assignee: {
            userId: 'USR-1',
            name: 'Siva Krishna',
        },
        dueDate: '2026-09-05T12:52:28.953Z',
    },
    {
        id: '2',
        title: 'Task 2',
        description: 'Description for Task 2',
        status: 'Todo',
        createdAt: '',
        assignee: {
            userId: 'USR-3',
            name: 'Dileep',
        },
    },
    {
        id: '3',
        title: 'Task 3',
        description: 'Description for Task 3',
        status: 'Todo',
        createdAt: '',
        assignee: {
            userId: 'USR-2',
            name: 'Mahesh',
        },
        dueDate: '2026-09-08T12:52:28.953Z',
    },
    {
        id: '4',
        title: 'Task 4',
        description: 'Description for Task 4',
        status: 'In Progress',
        createdAt: '',
        assignee: {
            userId: 'USR-3',
            name: 'Dileep',
        },
        dueDate: '2026-09-10T12:52:28.953Z',
    },
    {
        id: '5',
        title: 'Task 5',
        description: 'Description for Task 5',
        status: 'In Progress',
        createdAt: '',
        assignee: {
            userId: 'USR-2',
            name: 'Mahesh',
        },
    },
    {
        id: '6',
        title: 'Task 6',
        description: 'Description for Task 6',
        status: 'Done',
        createdAt: '',
        assignee: {
            userId: 'USR-1',
            name: 'Siva Krishna',
        },
    },
];

export const mockUsers: User[] = [
    { userId: 'USR-1', name: 'Siva Krishna' },
    { userId: 'USR-2', name: 'Mahesh' },
    { userId: 'USR-3', name: 'Dileep' },
];
