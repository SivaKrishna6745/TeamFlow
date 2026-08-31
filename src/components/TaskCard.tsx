import React from 'react';
import { Task } from '@/types';

const TaskCard = ({ task }: { task: Task }) => {
    return (
        <div className="border border-stone-400/80 rounded-sm p-4 my-2">
            <p>{task.desc}</p>
            <p>{task.status}</p>
        </div>
    );
};

export default TaskCard;
