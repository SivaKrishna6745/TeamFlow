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

const TaskBoard = () => {
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Task[]>(tasksData);
    const [formMode, setFormMode] = useState<FormMode>('New');
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

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

    const updateTask = (id: string, changes: { desc?: string; status?: Status }) => {
        setTasks((prevTasks) =>
            prevTasks.map((t) =>
                t.id === id ? { ...t, desc: changes.desc ?? t.desc, status: changes.status ?? t.status } : t,
            ),
        );
        setEditingTask(undefined);
        setFormMode('New');
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
            <Filters />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {STATUSES.map((status) => (
                    <div className="border border-slate-400 rounded-md p-2" key={status}>
                        <h2 className="text-xl font-bold uppercase text-center mb-4">{status}</h2>
                        {tasks
                            .filter((task) => task.status === status)
                            .map((task) => (
                                <TaskCard key={task.id} task={task} edit={editTask} />
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskBoard;
