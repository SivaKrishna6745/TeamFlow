import React from 'react';
import { Task } from '@/types';
import Button from './Button';

type TaskCardProps = {
    task: Task;
    edit: (id: string) => void;
};

const TaskCard = ({ task, edit }: TaskCardProps) => {
    // const editATask = () => {
    //     ;
    // };

    return (
        <div className="border border-stone-400/80 rounded-sm p-4 my-2 flex justify-between items-center">
            <div>
                <p>{task.desc}</p>
                <p>{task.status}</p>
            </div>
            <Button
                label="Edit"
                className="px-3 py-1 text-sm bg-green-400 text-zinc-700 font-semibold hover:bg-green-500/80 active:scale-95 rounded-sm transition-all duration-300"
                onClick={() => edit(task.id)}
            />
        </div>
    );
};

export default TaskCard;
