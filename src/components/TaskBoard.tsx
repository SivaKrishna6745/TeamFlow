import React from 'react';
import Filters from './Filters';
import Button from './Button';
import TaskCard from './TaskCard';
import { tasksData } from '../../mockData';

export const STATUSES = ['Todo', 'In Progress', 'Done'] as const;

const TaskBoard = () => {
    return (
        <div className="flex flex-col gap-8 px-10">
            <div className="flex justify-between">
                <h2>My Tasks</h2>
                <Button
                    label={'+ New Task'}
                    className="px-5 py-2 rounded-sm bg-blue-400 hover:bg-blue-500/80 active:scale-95 transition-all duration-300"
                />
            </div>
            <Filters />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {STATUSES.map((status) => (
                    <div className="border border-slate-400 rounded-md p-2" key={status}>
                        <h2 className="text-xl font-bold uppercase text-center mb-4">{status}</h2>
                        {tasksData
                            .filter((task) => task.status === status)
                            .map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskBoard;
