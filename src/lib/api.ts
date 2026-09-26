import { CreateTaskInput, Task } from '@/types';

const BASE_API_URI: string = 'http://localhost:8080/api';

export async function getTasks(): Promise<Task[]> {
    try {
        const response = await fetch(`${BASE_API_URI}/tasks`);
        if (!response.ok) throw new Error('Failed while fetching the data');

        const tasksData = await response.json();
        return tasksData.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function createTask(taskData: CreateTaskInput): Promise<Task> {
    try {
        const response = await fetch(`${BASE_API_URI}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error('Failed while creating a task');

        const result = await response.json();
        return result.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function editTask(id: string | undefined, taskUpdates: Partial<Task>): Promise<Task> {
    try {
        const response = await fetch(`${BASE_API_URI}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskUpdates),
        });
        if (!response.ok) throw new Error('Error while fetching the task');

        const result = await response.json();
        return result.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function deleteATask(id: string | undefined): Promise<Task> {
    try {
        const response = await fetch(`${BASE_API_URI}/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Error while deleting the task');

        const result = await response.json();
        return result.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
