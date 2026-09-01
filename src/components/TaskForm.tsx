'use client';

import React, { useState } from 'react';
import { STATUSES } from './TaskBoard';
import Button from './Button';
import { FormMode, Status, Task } from '@/types';

interface TaskFormProps {
    tasks: Task[];
    close: () => void;
    add: (task: Task) => void;
    mode?: FormMode;
    editingTask: Task | undefined;
    update?: (id: string, changes: { desc?: string; status?: Status }) => void;
}

const TaskForm = ({ tasks, close, add, mode = 'New', editingTask = undefined, update }: TaskFormProps) => {
    const editMode = mode === 'Edit';

    const [desc, setDesc] = useState<string>(editMode ? (editingTask?.desc ?? '') : '');
    const [status, setStatus] = useState<Status>(editMode ? (editingTask?.status ?? 'Todo') : 'Todo');
    const [error, setError] = useState<string>('');

    const submitTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (desc.trim() === '') {
            setError('Please enter the task description');
            return;
        }

        if (!editMode && tasks.some((task) => task.desc.trim() === desc.trim())) {
            setError('Task already exists!');
            return;
        }

        if (editMode && tasks.some((t) => t.id !== editingTask?.id && t.desc.trim() === desc.trim())) {
            setError('Task already exists!');
            return;
        }

        const newTask = {
            id: crypto.randomUUID(),
            desc,
            status,
            createdAt: new Date().toISOString(),
        };

        if (editMode && editingTask) update?.(editingTask.id, { desc, status });
        else add(newTask);

        setDesc('');
        setStatus('Todo');
        setError('');
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
            <textarea
                name="desc"
                placeholder="Description of the task..."
                rows={4}
                cols={30}
                value={desc}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setDesc(e.target.value);
                    setError('');
                }}
                className="border border-stone-300 rounded-sm px-2 py-1"
            ></textarea>
            {error && <p className="text-xs text-red-500">{error}</p>}
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
