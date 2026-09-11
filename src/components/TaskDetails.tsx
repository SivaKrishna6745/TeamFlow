import React, { useEffect } from 'react';
import Button from './Button';
import { Task } from '@/types';

interface TaskDetailsProps {
    task: Task;
    close: () => void;
    edit: (id: string) => void;
}

const TaskDetails = ({ task, close, edit }: TaskDetailsProps) => {
    const isOverDue = task.dueDate
        ? new Date(task.dueDate).toISOString().split('T')[0] < new Date().toISOString().split('T')[0]
        : false;

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };
        document.addEventListener('keydown', listener);

        return () => document.removeEventListener('keydown', listener);
    }, [close]);

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
                        <span className="font-medium text-xs uppercase tracking-wider text-zinc-500 w-20">Status</span>
                        <span className="font-medium text-zinc-300">{task.status}</span>
                        {isOverDue && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-red-400 border border-red-500/20">
                                ⚠️ Overdue
                            </span>
                        )}
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
                <div className="flex items-center justify-between border-t border-zinc-600 pt-4">
                    <Button
                        label="Edit Task"
                        className="px-5 w-max py-1.5 text-xs tracking-wide font-medium text-zinc-300 bg-green-500/40 rounded-md hover:bg-green-500/50 transition-colors duration-150"
                        onClick={() => {
                            edit(task.id);
                            close();
                        }}
                    />
                    <Button
                        label="Close"
                        className="px-5 w-max py-1.5 text-xs tracking-wide font-medium text-zinc-400 bg-zinc-600/40 rounded-md hover:bg-zinc-500/50 transition-colors duration-150"
                        onClick={close}
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
