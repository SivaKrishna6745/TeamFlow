import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Status, Task } from '@/types';

type TaskColumnProps = {
    status: Status;
    tasks: Task[];
    editTask: (id: string) => void;
    deleteTask: (id: string) => void;
    dragStart: (id: string) => void;
    dragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    drop: (colStatus: Status) => void;
};

const TaskColumn = ({ status, tasks, editTask, deleteTask, dragStart, dragOver, drop }: TaskColumnProps) => {
    const [isDragOver, setIsDragOver] = useState<boolean>(false);

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        const relTarget = e.relatedTarget;
        if (relTarget instanceof Node && !e.currentTarget.contains(relTarget)) setIsDragOver(false);
    };

    return (
        <div
            onDrop={() => {
                drop(status);
                setIsDragOver(false);
            }}
            onDragEnter={() => setIsDragOver(true)}
            onDragOver={dragOver}
            onDragLeave={handleDragLeave}
            className={`bg-zinc-800/90 rounded-md p-4 transition-all duration-75 ${isDragOver ? 'shadow-md shadow-white/50' : ''}`}
        >
            <h2 className="text-xl font-bold uppercase text-center mb-4 text-zinc-200 tracking-wide pb-3 border-b-2 border-zinc-400">
                {status}
            </h2>
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} edit={editTask} del={deleteTask} dragStart={dragStart} />
            ))}
        </div>
    );
};

export default TaskColumn;
