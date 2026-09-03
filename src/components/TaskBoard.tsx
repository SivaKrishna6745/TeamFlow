'use client';

import { useState } from 'react';
import Filters from './Filters';
import Button from './Button';
import TaskCard from './TaskCard';
import { tasksData } from '../../mockData';
import TaskForm from './TaskForm';
import { FormMode, Status, Task } from '@/types';

export const STATUSES = ['Todo', 'In Progress', 'Done'] as const;

export const FORM_MODES = ['New', 'Edit'] as const;

const DelConfirmationPopup = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => {
    return (
        <>
            <div className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"></div>
            <div className="fixed top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center gap-8 rounded-lg z-50 p-8 bg-zinc-900 shadow-2xl">
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl text-zinc-300 tracking-wide font-semibold uppercase">Delete Task</h3>
                    <p className="text-sm text-zinc-400 tracking-wide leading-6">
                        Are you sure you want to delete this task? This action cannot be undone and will permanently
                        remove the data.
                    </p>
                </div>
                <div className="flex gap-4 items-center justify-end">
                    <Button
                        label="Cancel"
                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-zinc-400 bg-transparent border border-zinc-700 rounded-sm transition-colors hover:bg-zinc-800 hover:text-zinc-200 active:scale-98"
                        onClick={onCancel}
                    />
                    <Button
                        label="Confirm"
                        className="w-full sm:w-auto px-5 py-2 text-sm font-medium text-white bg-red-600/50 rounded-sm shadow-sm shadow-red-900/20 transition-all hover:bg-red-500/60 hover:shadow-red-500/20 active:scale-98"
                        onClick={onConfirm}
                    />
                </div>
            </div>
        </>
    );
};

const TaskBoard = () => {
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Task[]>(tasksData);
    const [formMode, setFormMode] = useState<FormMode>('New');
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [confirmDel, setConfirmDel] = useState<string | undefined>(undefined);

    const openForm = () => {
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
    };

    const addTask = (task: Task) => {
        setTasks((prevTasks) => [...prevTasks, task]);
    };

    const editTask = (id: string) => {
        setIsFormOpen(true);
        setFormMode('Edit');
        const task = tasks.find((t) => t.id === id);
        setEditingTask(task);
    };

    const updateTask = (id: string, changes: { title?: string; description?: string; status?: Status }) => {
        setTasks((prevTasks) =>
            prevTasks.map((t) =>
                t.id === id
                    ? {
                          ...t,
                          title: changes.title ?? t.title,
                          description: changes.description ?? t.description,
                          status: changes.status ?? t.status,
                      }
                    : t,
            ),
        );
        setEditingTask(undefined);
        setFormMode('New');
    };

    const deleteTask = (id: string) => {
        setConfirmDel(id);
    };

    return (
        <div className="relative flex flex-col gap-8 px-10">
            <div className="flex justify-between">
                <h2>My Tasks</h2>
                <Button
                    label={'+ New Task'}
                    className="px-5 py-2 rounded-sm bg-blue-400 hover:bg-blue-500/80 active:scale-95 transition-all duration-300"
                    onClick={openForm}
                />
            </div>
            {isFormOpen && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.9)] z-50 flex items-center justify-center">
                    <TaskForm
                        tasks={tasks}
                        close={closeForm}
                        add={addTask}
                        mode={formMode}
                        editingTask={editingTask}
                        update={updateTask}
                    />
                </div>
            )}
            {confirmDel && (
                <DelConfirmationPopup
                    onConfirm={() => {
                        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== confirmDel));
                        setConfirmDel(undefined);
                    }}
                    onCancel={() => setConfirmDel(undefined)}
                />
            )}
            <Filters />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {STATUSES.map((status) => (
                    <div className="border border-slate-400 rounded-md p-4" key={status}>
                        <h2 className="text-xl font-bold uppercase text-center mb-4">{status}</h2>
                        {tasks
                            .filter((task) => task.status === status)
                            .map((task) => (
                                <TaskCard key={task.id} task={task} edit={editTask} del={deleteTask} />
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskBoard;
