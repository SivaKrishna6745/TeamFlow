import React from 'react';
import { Task } from '@/types';
import Button from './Button';

type TaskCardProps = {
    task: Task;
    edit: (id: string) => void;
    del: (id: string) => void;
};

const TaskCard = ({ task, edit, del }: TaskCardProps) => {
    return (
        <div className="border border-stone-400/80 rounded-sm p-4 my-2 flex justify-between items-center">
            <div>
                <p>{task.desc}</p>
                <p>{task.status}</p>
            </div>
            <div className="flex gap-4">
                <Button
                    label="Edit"
                    className="px-3 py-1 text-sm bg-green-600 text-zinc-200 font-semibold hover:bg-green-500 active:scale-95 rounded-sm transition-all duration-300"
                    onClick={() => edit(task.id)}
                />
                <Button
                    label="Delete"
                    className="px-3 py-1 text-sm bg-red-600 text-zinc-200 font-semibold hover:bg-red-500 active:scale-95 rounded-sm transition-all duration-300"
                    onClick={() => del(task.id)}
                />
            </div>
        </div>
    );
};

export default TaskCard;
