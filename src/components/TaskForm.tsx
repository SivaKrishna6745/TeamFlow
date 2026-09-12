'use client';

import React, { useRef, useState } from 'react';
import { PRIORITIES, STATUSES } from '@/constants';
import Button from './Button';
import { FormMode, Priority, Status, Task, User } from '@/types';
import { mockUsers } from '../../mockData';

interface TaskFormProps {
    tasks: Task[];
    close: () => void;
    add: (task: Task) => void;
    mode?: FormMode;
    editingTask: Task | undefined;
    update?: (
        id: string,
        changes: {
            title?: string;
            description?: string;
            assignee?: User;
            status?: Status;
            priority?: Priority;
            dueDate?: string;
        },
    ) => void;
}

const FORM_FIELD_CLASSNAME =
    'border border-zinc-500 rounded-sm px-2 py-1 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-400';

const DiscardChangesModal = ({ closeModal, close }: { closeModal: () => void; close: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/20 backdrop-blur-md transition-opacity">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl shadow-zinc-200/50 dark:bg-zinc-900 dark:shadow-none">
                {/* Headline & Body Text */}
                <div className="flex flex-col gap-1.5 text-center sm:text-left">
                    <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Discard changes?
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        You will lose any unsaved progress. This action cannot be undone.
                    </p>
                </div>

                {/* Minimalist Action Buttons */}
                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
                    <Button
                        label="Cancel"
                        className="inline-flex items-center justify-center rounded-md bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200/80 active:scale-98 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80"
                        onClick={closeModal}
                    />
                    <Button
                        label="Discard"
                        className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 active:scale-98 dark:bg-red-500 dark:hover:bg-red-600"
                        onClick={() => {
                            closeModal();
                            close();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const TaskForm = ({ tasks, close, add, mode = 'New', editingTask = undefined, update }: TaskFormProps) => {
    const editMode = mode === 'Edit';

    const [title, setTitle] = useState<string>(editMode ? (editingTask?.title ?? '') : '');
    const [description, setDescription] = useState<string>(editMode ? (editingTask?.description ?? '') : '');
    const [status, setStatus] = useState<Status>(editMode ? (editingTask?.status ?? 'Todo') : 'Todo');
    const [priority, setPriority] = useState<Priority>(editMode ? (editingTask?.priority ?? 'Medium') : 'Medium');
    const [assignee, setAssignee] = useState<User>(editMode ? (editingTask?.assignee ?? mockUsers[0]) : mockUsers[0]);
    const [dueDate, setDueDate] = useState<string>(
        editMode && editingTask?.dueDate ? (new Date(editingTask?.dueDate).toISOString().split('T')[0] ?? '') : '',
    );
    const [error, setError] = useState<string>('');

    const currentValues = { title, description, assign: assignee.userId, status, priority, dueDate };
    const initialValuesSnapshotRef = useRef<{
        title: string | undefined;
        description: string | undefined;
        assign: string | undefined;
        status: Status | undefined;
        priority: Priority | undefined;
        dueDate: string | undefined;
    }>({
        title: editMode ? editingTask?.title : '',
        description: editMode ? editingTask?.description : '',
        assign: editMode ? editingTask?.assignee.userId : mockUsers[0].userId,
        status: editMode ? editingTask?.status : 'Todo',
        priority: editMode ? editingTask?.priority : 'Medium',
        dueDate: editMode && editingTask?.dueDate ? new Date(editingTask?.dueDate).toISOString().split('T')[0] : '',
    });
    const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false);

    const submitTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (description.trim() === '') {
            setError('Please enter the task description');
            return;
        }

        if (
            !editMode &&
            tasks.some((task) => task.title.trim() === title.trim() && task.description.trim() === description.trim())
        ) {
            setError('A task with the same title and description already exists.');
            return;
        }

        if (
            editMode &&
            tasks.some(
                (t) =>
                    t.id !== editingTask?.id &&
                    t.title.trim() === title.trim() &&
                    t.description.trim() === description.trim(),
            )
        ) {
            setError('A task with the same title and description already exists.');
            return;
        }

        const newTask = {
            id: crypto.randomUUID(),
            title,
            description,
            status,
            priority,
            createdAt: new Date().toISOString(),
            assignee: {
                userId: assignee.userId,
                name: assignee.name,
            },
            dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        };

        if (editMode && editingTask)
            update?.(editingTask.id, { title, description, assignee, status, priority, dueDate });
        else add(newTask);

        setTitle('');
        setDescription('');
        setStatus('Todo');
        setError('');
        setAssignee(mockUsers[0]);
        setPriority('Medium');
        setDueDate('');
        close();
    };

    const handleClose = () => {
        const isDirty = JSON.stringify(currentValues) !== JSON.stringify(initialValuesSnapshotRef.current);
        if (!isDirty) close();
        else setShowDiscardModal(true);
    };

    return (
        <form
            className="w-full max-w-md bg-zinc-900 text-white border border-zinc-700 rounded-lg p-6 flex flex-col gap-6 shadow-xl relative max-h-[70vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-400 scrollbar"
            onSubmit={submitTask}
        >
            <div className="flex justify-between items-center border-b-2 border-zinc-800 pb-4">
                <h2 className="text-center text-2xl uppercase font-bold tracking-wide">
                    {editMode ? 'Edit Task' : 'New Task'}
                </h2>
                <Button
                    className="text-zinc-400 hover:text-zinc-300 bg-zinc-800 hover:bg-zinc-600 rounded-full px-3 py-1 text-md"
                    label="x"
                    onClick={handleClose}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="id" className="text-xs uppercase tracking-wide text-zinc-400">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title of the task..."
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    className={FORM_FIELD_CLASSNAME}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-xs uppercase tracking-wide text-zinc-400">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Description of the task..."
                    rows={4}
                    cols={30}
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setDescription(e.target.value);
                        setError('');
                    }}
                    className={`${FORM_FIELD_CLASSNAME} resize-none`}
                ></textarea>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex flex-col gap-2">
                <label htmlFor="assignee" className="text-xs uppercase tracking-wide text-zinc-400">
                    Assignee
                </label>
                <select
                    id="assignee"
                    name="assignee"
                    value={assignee.userId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const user = mockUsers.find((user) => user.userId === e.target.value);
                        if (user) setAssignee(user);
                    }}
                    className={`${FORM_FIELD_CLASSNAME} cursor-pointer`}
                >
                    {mockUsers.map((user) => (
                        <option key={user.userId} value={user.userId} className="bg-zinc-900">
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="status" className="text-xs uppercase tracking-wide text-zinc-400">
                    Status
                </label>
                <select
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as Status)}
                    className={`${FORM_FIELD_CLASSNAME} cursor-pointer`}
                >
                    {STATUSES.map((st) => (
                        <option key={st} value={st} className="bg-zinc-900">
                            {st}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="priority" className="text-xs uppercase tracking-wide text-zinc-400">
                    Priority
                </label>
                <select
                    id="priority"
                    name="priority"
                    value={priority}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as Priority)}
                    className={`${FORM_FIELD_CLASSNAME} cursor-pointer`}
                >
                    {PRIORITIES.map((pri) => (
                        <option key={pri} value={pri} className="bg-zinc-900">
                            {pri}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="dueDate" className="text-xs uppercase tracking-wide text-zinc-400">
                    Due Date
                </label>
                <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={dueDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
                    className={FORM_FIELD_CLASSNAME}
                />
            </div>
            <Button
                type="submit"
                label={editMode ? 'Save Changes' : 'Add Task'}
                className="px-5 py-2 bg-green-600/70 hover:bg-green-400/70 text-zinc-200 font-semibold tracking-wider active:scale-98 rounded-sm transition-all duration-300"
            />
            {showDiscardModal && <DiscardChangesModal closeModal={() => setShowDiscardModal(false)} close={close} />}
        </form>
    );
};

export default TaskForm;
