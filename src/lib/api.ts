import { CreateTaskInput, Task } from '@/types';

const BASE_API_URI: string = 'http://localhost:8080/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiResponse<T> {
    data: T;
}

interface RequestOptions {
    method: HttpMethod;
    headers?: {
        'Content-Type': string;
    };
    body?: string;
}

const fetchHelper = async <T>(URI: string, options: RequestOptions, responseError: string): Promise<T> => {
    const requestOptions: RequestOptions = options.body
        ? {
              method: options.method,
              headers: {
                  'Content-Type': 'application/json',
              },
              body: options.body,
          }
        : {
              method: options.method,
          };

    const response = await fetch(URI, requestOptions);
    if (!response.ok) throw new Error(responseError);

    const result: ApiResponse<T> = await response.json();
    return result.data;
};

export async function getTasks(): Promise<Task[]> {
    const options: RequestOptions = {
        method: 'GET',
    };

    return fetchHelper<Task[]>(`${BASE_API_URI}/tasks`, options, 'Failed while fetching tasks');
}

export async function createTask(taskData: CreateTaskInput): Promise<Task> {
    const options: RequestOptions = {
        method: 'POST',
        body: JSON.stringify(taskData),
    };

    return fetchHelper<Task>(`${BASE_API_URI}/tasks`, options, 'Failed while creating a task');
}

export async function editTask(id: string | undefined, taskUpdates: Partial<Task>): Promise<Task> {
    const options: RequestOptions = {
        method: 'PUT',
        body: JSON.stringify(taskUpdates),
    };

    return fetchHelper<Task>(`${BASE_API_URI}/tasks/${id}`, options, 'Failed while updating the task');
}

export async function deleteATask(id: string | undefined): Promise<Task> {
    const options: RequestOptions = {
        method: 'DELETE',
    };

    return fetchHelper<Task>(`${BASE_API_URI}/tasks/${id}`, options, 'Failed while deleting the task');
}
