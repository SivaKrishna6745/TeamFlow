import React from 'react';
import { Task } from '@/types';
import Button from './Button';
import { CalendarDays } from 'lucide-react';

type TaskCardProps = {
    task: Task;
    edit: (id: string) => void;
    del: (id: string) => void;
    dragStart: (id: string) => void;
    setSelectedTask: (task: Task) => void;
    isMoved: boolean;
};

const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
        case 'high':
            return 'bg-red-400/20 border-red-400 text-red-400';
        case 'medium':
            return 'bg-amber-400/20 border-amber-400 text-amber-400';
        case 'low':
            return 'bg-emerald-400/20 border-emerald-400 text-emerald-400';
        default:
            return 'bg-zinc-400/20 border-zinc-400 text-zinc-400';
    }
};

const TaskCard = ({ task, edit, del, dragStart, setSelectedTask, isMoved }: TaskCardProps) => {
    const isOverDue = task.dueDate
        ? new Date(task.dueDate).toISOString().split('T')[0] < new Date().toISOString().split('T')[0]
        : false;

    let dayCreated = '';
    const createdAtDate = new Date(task.createdAt);
    const currentDate = new Date();
    const diff = new Date(currentDate).setHours(0, 0, 0, 0) - new Date(createdAtDate).setHours(0, 0, 0, 0);
    const diffInDays = Math.round(diff / (24 * 60 * 60 * 1000));
    switch (diffInDays) {
        case 0:
            dayCreated = 'Today';
            break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            dayCreated = `${diffInDays}d ago`;
            break;
        default:
            dayCreated = new Date(createdAtDate).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
            });
            break;
    }

    return (
        <div
            draggable
            className={`group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-6 my-3 flex flex-col justify-between items-baseline cursor-grab active:cursor-grabbing hover:shadow-md hover:shadow-black/20 transition-all duration-200 ${isMoved ? 'taskArrive' : ''}`}
            onDragStart={() => dragStart(task.id)}
            onClick={() => setSelectedTask(task)}
        >
            <div className="w-full flex justify-between">
                <div className="flex flex-col gap-4">
                    <p className="text-lg font-semibold tracking-wide text-zinc-100 wrap-break-word">{task.title}</p>
                    <p
                        id="descption"
                        className="text-base text-zinc-300 leading-relaxed wrap-break-word w-64 line-clamp-2"
                    >
                        {task.description}
                    </p>
                    <div className="flex gap-4">
                        {isOverDue && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-red-400/80 border border-red-400">
                                ⚠️ Overdue
                            </span>
                        )}
                        <span
                            className={`inline-flex font-semibold items-center text-xs px-2 py-0.5 rounded-full uppercase tracking-wider border ${getPriorityColor(task.priority)}`}
                        >
                            {task.priority}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="text-sm text-gray-400 flex items-center justify-center gap-1 self-end">
                        {dayCreated}
                    </div>
                    <div className="flex gap-4 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                            label="Edit"
                            className="px-3 py-1 text-xs bg-zinc-800 text-zinc-300 font-semibold hover:bg-green-500/20 hover:text-green-400 active:scale-95 rounded-sm transition-all duration-300 border border-zinc-700/50 hover:border-green-500/30"
                            onClick={(e) => {
                                e.stopPropagation();
                                edit(task.id);
                            }}
                        />
                        <Button
                            label="Delete"
                            className="px-3 py-1 text-xs bg-zinc-800 text-zinc-300 font-semibold hover:bg-red-500/20 hover:text-red-400 active:scale-95 rounded-sm transition-all duration-300 border border-zinc-700/50 hover:border-red-500/30"
                            onClick={(e) => {
                                e.stopPropagation();
                                del(task.id);
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="h-px w-full bg-zinc-600 my-6"></div>
            <div className="w-full flex items-center justify-between">
                <p className="text-zinc-500">
                    <span className="font-semibold text-zinc-300">{task.assignee.name}</span>
                </p>
                {task.dueDate && (
                    <div className="text-right mt-auto flex items-center justify-center gap-1">
                        <CalendarDays size={20} />
                        <span className="text-zinc-300 font-bold tracking-wide">
                            {new Date(task.dueDate).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
