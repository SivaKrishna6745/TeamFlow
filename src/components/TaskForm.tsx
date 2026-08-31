'use client';

import React, { useState } from 'react';
import { STATUSES } from './TaskBoard';
import Button from './Button';
import { Status, Task } from '@/types';
import { tasksData } from '../../mockData';

interface TaskFormProps {
    tasks: Task[];
    close: () => void;
    add: (task: Task) => void;
}

const TaskForm = ({ tasks, close, add }: TaskFormProps) => {
    const [desc, setDesc] = useState<string>('');
    const [status, setStatus] = useState<Status>('Todo');
    const [error, setError] = useState<string>('');

    const addATask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (desc.trim() === '') {
            setError('Please enter the task description');
            return;
        }

        if (tasks.some((task) => task.desc === desc)) {
            setError('Task already exists!');
            return;
        }

        const newTask = {
            id: crypto.randomUUID(),
            desc,
            status,
            createdAt: new Date().toISOString(),
        };

        add(newTask);
        setDesc('');
        setStatus('Todo');
        setError('');
        close();
    };

    return (
        <form
            className="w-full max-w-md bg-zinc-900 text-white border border-zinc-700 rounded-lg p-6 flex flex-col gap-4 shadow-xl relative"
            onSubmit={addATask}
        >
            <Button className="absolute top-3 right-3 text-zinc-400 hover:text-white" label="X" onClick={close} />
            <h2 className="text-center text-2xl uppercase font-bold tracking-wide">New Task</h2>
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
