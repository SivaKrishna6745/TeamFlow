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
    return (
        <div
            draggable
            className="border border-stone-400/80 rounded-sm p-4 my-3 flex justify-between items-center cursor-grab"
            onDragStart={() => dragStart(task.id)}
        >
            <div className="flex flex-col gap-2">
                <p id="title" className="text-lg uppercase">
                    {task.title}
                </p>
                <p id="descption" className="text-sm font-bold text-zinc-400">
                    {task.description}
                </p>
            </div>
            <div className="flex gap-4">
                <Button
                    label="Edit"
                    className="px-3 py-1 text-sm bg-green-600/50 text-zinc-200 font-semibold hover:bg-green-500/60 active:scale-95 rounded-sm transition-all duration-300"
                    onClick={() => edit(task.id)}
                />
                <Button
                    label="Delete"
                    className="px-3 py-1 text-sm bg-red-600/50 text-zinc-200 font-semibold hover:bg-red-500/60 active:scale-95 rounded-sm transition-all duration-300"
                    onClick={() => del(task.id)}
                />
            </div>
        </div>
    );
};

export default TaskCard;
