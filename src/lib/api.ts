import { Task } from '@/types';

const BASE_API_URI: string = 'http://localhost:8080/api';

export async function getTasks(): Promise<Task[]> {
    try {
        const response = await fetch(`${BASE_API_URI}/tasks`);
        if (!response.ok) throw new Error('Failed while fetching the data');

        const tasksData = await response.json();
        console.log(tasksData.data);
        return tasksData.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
