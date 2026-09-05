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

const FORM_FIELD_CLASSNAME =
    'border border-zinc-500 rounded-sm px-2 py-1 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-400';

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
            className="w-full max-w-md bg-zinc-900 text-white border border-zinc-700 rounded-lg p-6 flex flex-col gap-6 shadow-xl relative"
            onSubmit={submitTask}
        >
            <div className="flex justify-between items-center border-b-2 border-zinc-800 pb-4">
                <h2 className="text-center text-2xl uppercase font-bold tracking-wide">
                    {editMode ? 'Edit Task' : 'New Task'}
                </h2>
                <Button
                    className="text-zinc-400 hover:text-zinc-300 bg-zinc-800 hover:bg-zinc-600 rounded-full px-3 py-1 text-md"
                    label="x"
                    onClick={close}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="id" className="text-xs uppercase tracking-wide text-zinc-400">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title of the task..."
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    className={FORM_FIELD_CLASSNAME}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-xs uppercase tracking-wide text-zinc-400">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Description of the task..."
                    rows={4}
                    cols={30}
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setDescription(e.target.value);
                        setError('');
                    }}
                    className={`${FORM_FIELD_CLASSNAME} resize-none`}
                ></textarea>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex flex-col gap-2">
                <label htmlFor="assignee" className="text-xs uppercase tracking-wide text-zinc-400">
                    Assignee
                </label>
                <select
                    id="assignee"
                    name="assignee"
                    value={assignee.userId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const user = mockUsers.find((user) => user.userId === e.target.value);
                        if (user) setAssignee(user);
                    }}
                    className={`${FORM_FIELD_CLASSNAME} cursor-pointer`}
                >
                    {mockUsers.map((user) => (
                        <option key={user.userId} value={user.userId} className="bg-zinc-900">
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="status" className="text-xs uppercase tracking-wide text-zinc-400">
                    Status
                </label>
                <select
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as Status)}
                    className={`${FORM_FIELD_CLASSNAME} cursor-pointer`}
                >
                    {STATUSES.map((st) => (
                        <option key={st} value={st} className="bg-zinc-900">
                            {st}
                        </option>
                    ))}
                </select>
            </div>
            <Button
                type="submit"
                label={editMode ? 'Save Changes' : 'Add Task'}
                className="px-5 py-2 bg-green-600/70 hover:bg-green-400/70 text-zinc-200 font-semibold tracking-wider active:scale-98 rounded-sm transition-all duration-300"
            />
        </form>
    );
};

export default TaskForm;
