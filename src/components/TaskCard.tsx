import React from 'react';
import { Task } from '@/types';
import Button from './Button';

type TaskCardProps = {
    task: Task;
    edit: (id: string) => void;
    del: (id: string) => void;
    dragStart: (id: string) => void;
};

const TaskCard = ({ task, edit, del, dragStart }: TaskCardProps) => {
    const isOverDue =
        task.dueDate !== undefined
            ? new Date(task.dueDate).toISOString().split('T')[0] < new Date().toISOString().split('T')[0]
            : '';

    return (
        <div
            draggable
            className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-sm p-5 my-3 flex justify-between items-baseline cursor-grab active:cursor-grabbing hover:shadow-md hover:shadow-black/20 transition-all duration-200"
            onDragStart={() => dragStart(task.id)}
        >
            <div className="flex flex-col gap-2">
                <p
                    id="title"
                    className="flex flex-wrap items-center gap-2 text-base font-semibold tracking-wide text-zinc-100 break-words"
                >
                    <span>{task.title}</span>
                    {isOverDue && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-red-400 border border-red-500/20">
                            ⚠️ Overdue
                        </span>
                    )}
                </p>
                <p id="descption" className="text-sm text-zinc-400 leading-relaxed wrap-break-word">
                    {task.description}
                </p>
                <p className="text-xs text-zinc-500">
                    <span>Assigned to </span>
                    <span className="font-semibold text-zinc-300">{task.assignee.name}</span>
                    <span className="ml-2 text-zinc-400 font-medium">({task.assignee.userId})</span>
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex gap-4 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                        label="Edit"
                        className="px-3 py-1 text-xs bg-zinc-800 text-zinc-300 font-semibold hover:bg-green-500/20 hover:text-green-400 active:scale-95 rounded-sm transition-all duration-300 border border-zinc-700/50 hover:border-green-500/30"
                        onClick={() => edit(task.id)}
                    />
                    <Button
                        label="Delete"
                        className="px-3 py-1 text-xs bg-zinc-800 text-zinc-300 font-semibold hover:bg-red-500/20 hover:text-red-400 active:scale-95 rounded-sm transition-all duration-300 border border-zinc-700/50 hover:border-red-500/30"
                        onClick={() => del(task.id)}
                    />
                </div>
                {task.dueDate && (
                    <div className="text-right mt-auto">
                        <span className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            Due Date
                        </span>
                        <span className="text-xs text-zinc-400 font-medium">
                            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
