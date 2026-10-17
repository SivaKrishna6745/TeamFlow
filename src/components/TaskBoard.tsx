/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useRef, useState } from 'react';
import Filters, { FILTERS } from './Filters';
import Button from './Button';
import TaskForm from './TaskForm';
import { Filter, FormMode, SortOptions, Status, Task, ToastType } from '@/types';
import TaskColumn from './TaskColumn';
import { SORT_OPTIONS, STATUSES } from '@/constants';
import SearchBar from './SearchBar';
import TaskDetails from './TaskDetails';
import { deleteATask, editATask, getTasks } from '@/lib/api';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const PRIORITY_RANKS = {
    High: 3,
    Medium: 2,
    Low: 1,
};

const getSortComparator = (sortOption: SortOptions): ((a: Task, b: Task) => number) => {
    switch (sortOption) {
        case 'newest first':
            return (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest first':
            return (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority high':
            return (a, b) => PRIORITY_RANKS[b.priority] - PRIORITY_RANKS[a.priority];
        case 'priority low':
            return (a, b) => PRIORITY_RANKS[a.priority] - PRIORITY_RANKS[b.priority];
    }
};

const useDebounce = (input: string) => {
    const [debouncedInput, setDebouncedInput] = useState<string>(input);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedInput(input);
        }, 500);

        return () => clearTimeout(timer);
    }, [input]);

    return debouncedInput;
};

const DelConfirmationPopup = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => {
    return (
        <>
            <div className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"></div>
            <div className="fixed top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center gap-8 rounded-lg z-50 p-8 bg-zinc-900 shadow-2xl">
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl text-zinc-300 tracking-wide font-semibold uppercase">Delete Task</h3>
                    <p className="text-sm text-zinc-400 tracking-wide leading-6">
                        Are you sure you want to delete this task? This action cannot be undone and will permanently
                        remove the data.
                    </p>
                </div>
                <div className="flex gap-4 items-center justify-end">
                    <Button
                        label="Cancel"
                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-zinc-400 bg-transparent border border-zinc-700 rounded-sm transition-colors hover:bg-zinc-800 hover:text-zinc-200 active:scale-98"
                        onClick={onCancel}
                    />
                    <Button
                        label="Confirm"
                        className="w-full sm:w-auto px-5 py-2 text-sm font-medium text-white bg-red-600/50 rounded-sm shadow-sm shadow-red-900/20 transition-all hover:bg-red-500/60 hover:shadow-red-500/20 active:scale-98"
                        onClick={onConfirm}
                    />
                </div>
            </div>
        </>
    );
};

const TaskBoard = () => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const currentQuery = params.toString();
    const rawfilter = params.get('filter') ?? 'All';
    const filter: Filter = rawfilter && FILTERS.includes(rawfilter as Filter) ? (rawfilter as Filter) : 'All';
    const search = params.get('search') ?? '';

    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [formMode, setFormMode] = useState<FormMode>('New');
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [confirmDel, setConfirmDel] = useState<string | undefined>(undefined);
    const [draggingId, setDraggingId] = useState<string | undefined>(undefined);
    const [movedTaskId, setMovedTaskId] = useState<string | undefined>(undefined);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | undefined>({
        message: '',
        type: 'Success',
    });
    const [deleteToast, setDeleteToast] = useState<string | undefined>(undefined);
    // const [filter, setFilter] = useState<Filter>(params.get('filter') as Filter?? 'All');
    const [sortOption, setSortOption] = useState<SortOptions>('newest first');
    const [searchInput, setSearchInput] = useState<string>('');
    const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [retryCount, setRetryCount] = useState<number>(0);

    const debouncedInput = useDebounce(searchInput);

    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    const versionRef = useRef<Record<string, number>>({});

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const loadTasks = async () => {
            setLoading(true);
            setError('');

            try {
                const data = await getTasks(signal);
                setTasks(data);
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }
                setError(error instanceof Error ? error.message : 'Failed while fetching data');
            } finally {
                setLoading(false);
            }
        };

        loadTasks();

        return () => controller.abort();
    }, [retryCount]);

    const currentUserId = 'USR-1';

    const openForm = () => {
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setFormMode('New');
    };

    const addTask = (task: Task) => {
        setTasks((prevTasks) => [...prevTasks, task]);
    };

    const editTask = (id: string) => {
        setIsFormOpen(true);
        setFormMode('Edit');
        const task = tasks.find((t) => t.id === id);
        setEditingTask(task);
    };

    const updateTask = (task: Task) => {
        setTasks((prevTasks) => prevTasks.map((t) => (t.id === task.id ? task : t)));
        setEditingTask(undefined);
        setFormMode('New');
    };

    const deleteTask = (id: string) => {
        setConfirmDel(id);
    };

    const confirmDeletion = async () => {
        try {
            const task = await deleteATask(confirmDel);
            setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
            setConfirmDel(undefined);
        } catch (err) {
            console.error(err);
            setDeleteToast(err instanceof Error ? err.message : 'Failed to delete task');
        }
    };

    const handleDragStart = (id: string) => {
        setDraggingId(id);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = async (status: Status) => {
        if (!draggingId) return;

        const previousStatus = tasks.find((t) => t.id === draggingId)?.status;
        setTasks((prevTasks) => prevTasks.map((t) => (t.id === draggingId ? { ...t, status: status } : t)));
        setDraggingId(undefined);
        setMovedTaskId(draggingId);
        versionRef.current[draggingId] = (versionRef.current[draggingId] ?? 0) + 1;
        const requestVersion = versionRef.current[draggingId];

        try {
            await editATask(draggingId, { status });
            if (previousStatus !== status) setToast({ message: `Task moved to ${status}`, type: 'Success' });
        } catch (err) {
            if (requestVersion !== versionRef.current[draggingId]) return;
            console.error(err);
            setTasks((prevTasks) =>
                prevTasks.map((t) => (t.id === draggingId ? { ...t, status: previousStatus! } : t)),
            );
            setToast({ message: 'Failed to move task. Changes reverted.', type: 'Failure' });
        }
    };

    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(() => {
            setToast(undefined);
        }, 2000);

        return () => clearTimeout(timer);
    }, [toast]);

    useEffect(() => {
        if (!movedTaskId) return;

        const timer = setTimeout(() => {
            setMovedTaskId(undefined);
        }, 600);

        return () => clearTimeout(timer);
    }, [movedTaskId]);

    useEffect(() => {
        if (!deleteToast) return;

        const timer = setTimeout(() => {
            setDeleteToast(undefined);
        }, 2000);

        return () => clearTimeout(timer);
    }, [deleteToast]);

    useEffect(() => {
        const updatedParams = new URLSearchParams(params.toString());
        if (debouncedInput === '') {
            updatedParams.delete('search');
        } else {
            updatedParams.set('search', debouncedInput);
        }

        const query = updatedParams.toString();

        if (query !== currentQuery) {
            router.replace(query ? `${pathname}?${query}` : pathname, {
                scroll: false,
            });
        }
    }, [currentQuery, debouncedInput, params, pathname, router]);

    const selectFilter = (filter: Filter) => {
        const updatedParams = new URLSearchParams(params.toString());
        if (updatedParams.get('filter') === 'All') {
            updatedParams.delete('filter');
        } else {
            updatedParams.set('filter', filter);
        }

        const query = updatedParams.toString();

        if (query !== currentQuery) {
            router.push(query ? `${pathname}?${query}` : pathname, {
                scroll: false,
            });
        }
    };

    const derivedTasks =
        filter === 'All'
            ? tasks
            : filter === 'Mine'
              ? tasks.filter((t) => t.assignee.userId === currentUserId)
              : tasks.filter((t) => t.status === filter);

    const searchedTasks =
        search.trim() === ''
            ? derivedTasks
            : derivedTasks.filter(
                  (task) =>
                      task.title.toLowerCase().includes(search.toLowerCase()) ||
                      task.description.toLowerCase().includes(search.toLowerCase()),
              );

    const sortedTasks = [...searchedTasks].sort(getSortComparator(sortOption));

    const overdueTasksCount = searchedTasks.filter(
        (task) =>
            task.dueDate && new Date(task.dueDate).toISOString().split('T')[0] < new Date().toISOString().split('T')[0],
    ).length;

    const handleSelectedTask = (task: Task) => setSelectedTask(task);

    const copyTaskId = async (id: string) => {
        try {
            await navigator.clipboard.writeText(id);
            setToast({ message: 'Copied Task Id', type: 'Success' });
        } catch {
            setToast({ message: 'Failed to copy Task Id', type: 'Failure' });
        }
    };

    return (
        <div className="relative flex flex-col gap-8 px-10">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-8">
                <h2 className="text-2xl font-bold tracking-wider">My Tasks</h2>
                <Button
                    label={'+ New Task'}
                    className="px-5 py-2 rounded-sm bg-blue-600/50 hover:bg-blue-500/60 active:scale-95 transition-all duration-300"
                    onClick={openForm}
                />
            </div>
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <TaskForm
                        tasks={tasks}
                        close={closeForm}
                        add={addTask}
                        mode={formMode}
                        editingTask={editingTask}
                        update={updateTask}
                    />
                </div>
            )}
            {confirmDel && (
                <DelConfirmationPopup onConfirm={confirmDeletion} onCancel={() => setConfirmDel(undefined)} />
            )}
            <div className="flex justify-between">
                <div className="flex items-center gap-8 text-sm bg-zinc-900/60 px-4 py-2 rounded-md border border-zinc-800">
                    <span className="uppercase tracking-wide font-medium text-zinc-400">Filters: </span>
                    <div className="h-4 w-px bg-zinc-800" />
                    <Filters selectedFilter={filter} select={selectFilter} />
                </div>
                <div className="flex items-center gap-4">
                    <label htmlFor="task-sort" className="text-sm text-zinc-400">
                        Sort by
                    </label>

                    <select
                        id="task-sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as SortOptions)}
                        className="rounded-md border border-mauve-600 bg-mauve-800 px-4 py-3 text-sm
                                text-white transition-colors hover:bg-mauve-700
                                focus-visible:outline-none"
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {
                                    {
                                        'newest first': 'Newest first',
                                        'oldest first': 'Oldest first',
                                        'priority high': 'Priority: High → Low',
                                        'priority low': 'Priority: Low → High',
                                    }[option]
                                }
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex items-center gap-12">
                <SearchBar value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                <p className="flex items-center gap-2 rounded-md border border-red-800/60 bg-red-900/20 px-3 py-2 text-sm text-red-200">
                    <span>Overdue</span>{' '}
                    <strong className="rounded bg-red-900/60 px-2 py-0.5">{overdueTasksCount}</strong>
                </p>
            </div>
            <div>
                {loading ? (
                    <div className="font-medium text-blue-500 text-center border border-blue-800/60 rounded-xl py-16 flex flex-col gap-3 items-center">
                        <div className="h-8 w-8 rounded-full border-4 border-zinc-700 border-t-blue-500 animate-spin"></div>
                        <span>Loading tasks... please wait!!</span>
                    </div>
                ) : error ? (
                    <div className="font-medium text-red-500 text-center border border-red-800/60 rounded-xl py-16 flex flex-col gap-3 items-center">
                        <svg
                            className="w-8 h-8 text-red-500/80"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <span>{error}</span>
                        <button onClick={() => setRetryCount((prev) => prev + 1)}>Retry</button>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="flex flex-col gap-1 items-center justify-center py-16 text-center border border-zinc-800/60 rounded-xl bg-zinc-900/30">
                        <p className="font-medium text-zinc-400">No tasks yet</p>
                        <p className="mt-1 text-sm text-zinc-500">Create a task to get started.</p>
                        <Button
                            label={'+ New Task'}
                            className="mt-6 px-5 py-2 rounded-sm bg-blue-600/50 hover:bg-blue-500/60 active:scale-98 transition-all duration-200"
                            onClick={openForm}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {STATUSES.map((status) => (
                            <TaskColumn
                                key={status}
                                status={status}
                                tasks={sortedTasks.filter((t) => t.status === status)}
                                editTask={editTask}
                                deleteTask={deleteTask}
                                dragStart={handleDragStart}
                                dragOver={handleDragOver}
                                drop={handleDrop}
                                setSelectedTask={handleSelectedTask}
                                movedTaskId={movedTaskId}
                            />
                        ))}
                    </div>
                )}
            </div>
            {selectedTask && (
                <TaskDetails
                    task={selectedTask}
                    close={() => setSelectedTask(undefined)}
                    edit={editTask}
                    copy={copyTaskId}
                    del={deleteTask}
                />
            )}
            {toast?.message && (
                <p
                    className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50  text-sm px-6 py-3  rounded-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${toast.type === 'Success' ? 'text-green-400 bg-green-700/40' : 'text-red-400 bg-red-700/40'}`}
                >
                    {toast.message}
                </p>
            )}
            {deleteToast && (
                <p className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 text-red-400 text-sm px-6 py-3 bg-red-700/40 rounded-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
                    {deleteToast}
                </p>
            )}
        </div>
    );
};

export default TaskBoard;
