'use client';

import React, { useState } from 'react';
import { STATUSES } from './TaskBoard';
import Button from './Button';
import { FormMode, Status, Task, User } from '@/types';
import { mockUsers } from '../../mockData';

interface TaskFormProps {
    tasks: Task[];
    close: () => void;
    add: (task: Task) => void;
    mode?: FormMode;
    editingTask: Task | undefined;
    update?: (id: string, changes: { title?: string; description?: string; assignee?: User; status?: Status }) => void;
}

const TaskForm = ({ tasks, close, add, mode = 'New', editingTask = undefined, update }: TaskFormProps) => {
    const editMode = mode === 'Edit';

    const [title, setTitle] = useState<string>(editMode ? (editingTask?.title ?? '') : '');
    const [description, setDescription] = useState<string>(editMode ? (editingTask?.description ?? '') : '');
    const [status, setStatus] = useState<Status>(editMode ? (editingTask?.status ?? 'Todo') : 'Todo');
    const [assignee, setAssignee] = useState<User>(editMode ? (editingTask?.assignee ?? mockUsers[0]) : mockUsers[0]);
    const [error, setError] = useState<string>('');

    const submitTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (description.trim() === '') {
            setError('Please enter the task description');
            return;
        }

        if (
            !editMode &&
            tasks.some((task) => task.title.trim() === title.trim() && task.description.trim() === description.trim())
        ) {
            setError('A task with the same title and description already exists.');
            return;
        }

        if (
            editMode &&
            tasks.some(
                (t) =>
                    t.id !== editingTask?.id &&
                    t.title.trim() === title.trim() &&
                    t.description.trim() === description.trim(),
            )
        ) {
            setError('A task with the same title and description already exists.');
            return;
        }

        const newTask = {
            id: crypto.randomUUID(),
            title,
            description,
            status,
            createdAt: new Date().toISOString(),
            assignee: {
                userId: assignee.userId,
                name: assignee.name,
            },
        };

        if (editMode && editingTask) update?.(editingTask.id, { title, description, assignee, status });
        else add(newTask);

        setTitle('');
        setDescription('');
        setStatus('Todo');
        setError('');
        setAssignee(mockUsers[0]);
        close();
    };

    return (
        <form
            className="w-full max-w-md bg-zinc-900 text-white border border-zinc-700 rounded-lg p-6 flex flex-col gap-4 shadow-xl relative"
            onSubmit={submitTask}
        >
            <Button className="absolute top-3 right-3 text-zinc-400 hover:text-white" label="X" onClick={close} />
            <h2 className="text-center text-2xl uppercase font-bold tracking-wide">
                {editMode ? 'Edit Task' : 'New Task'}
            </h2>
            <input
                type="text"
                name="title"
                placeholder="title of the task..."
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                className="border border-stone-300 rounded-sm px-2 py-1"
            />
            <textarea
                name="description"
                placeholder="description of the task..."
                rows={4}
                cols={30}
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setDescription(e.target.value);
                    setError('');
                }}
                className="border border-stone-300 rounded-sm px-2 py-1"
            ></textarea>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <select
                name="assignee"
                value={assignee.userId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const user = mockUsers.find((user) => user.userId === e.target.value);
                    if (user) setAssignee(user);
                }}
                className="border border-stone-300 bg-zinc-900 rounded-sm px-2 py-1"
            >
                {mockUsers.map((user) => (
                    <option key={user.userId} value={user.userId}>
                        {user.name}
                    </option>
                ))}
            </select>
            <select
                name="status"
                value={status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as Status)}
                className="border border-stone-300 bg-zinc-900 rounded-sm px-2 py-1"
            >
                {STATUSES.map((st) => (
                    <option key={st} value={st}>
                        {st}
                    </option>
                ))}
            </select>
            <Button
                type="submit"
                label="Submit"
                className="px-5 py-2 bg-green-400 hover:bg-green-500/80 active:scale-95 rounded-sm transition-all duration-300"
            />
        </form>
    );
};

export default TaskForm;
