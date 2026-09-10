import React from 'react';
import Button from './Button';
import { Task } from '@/types';

interface TaskDetailsProps {
    task: Task;
    close: () => void;
}

const TaskDetails = ({ task, close }: TaskDetailsProps) => {
    return (
        <div
            className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center"
            onClick={close}
        >
            <div
                className="flex flex-col gap-4 justify-center border border-zinc-800 bg-zinc-700/40 rounded-lg w-sm p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block pb-4 mx-auto border-b border-zinc-400">
                    Task Overview
                </p>

                <h2 className="text-xl font-bold text-zinc-100 border-b border-zinc-600 pb-4">{task?.title}</h2>
                <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/50">
                    {task.description}
                </p>
                <div className="flex flex-col gap-3.5 pl-1">
                    <div className="flex items-center gap-2 text-sm border-l-2 border-zinc-700 pl-3">
                        <span className="font-medium text-xs uppercase tracking-wider text-zinc-500 w-20">
                            Assignee
                        </span>
                        <span className="font-medium text-zinc-300">{task.assignee.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm border-l-2 border-zinc-700 pl-3">
                        <span className="font-medium text-xs uppercase tracking-wider text-zinc-500 w-20">
                            Due date
                        </span>
                        <span className="font-medium text-zinc-300">
                            {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                  })
                                : 'No Due Date'}
                        </span>
                    </div>
                </div>
                <Button
                    label="Close"
                    className="px-4 w-max py-1.5 text-xs font-medium text-zinc-400 bg-zinc-800/40 rounded-md hover:bg-zinc-700/50 transition-colors duration-150"
                    onClick={close}
                />
            </div>
        </div>
    );
};

export default TaskDetails;
