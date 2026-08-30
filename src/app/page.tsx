import Header from '@/components/Header';
import TaskBoard from '@/components/TaskBoard';

export default function Home() {
    return (
        <div className="dark:bg-black flex flex-col gap-6">
            <Header />
            <TaskBoard />
        </div>
    );
}
