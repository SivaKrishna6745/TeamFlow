import { Filter } from '@/types';

export const FILTERS = ['All', 'Mine', 'Todo', 'In Progress', 'Done'] as const;

type FiltersProps = {
    selectedFilter: Filter;
    select: (filter: Filter) => void;
};

const Filters = ({ select, selectedFilter }: FiltersProps) => {
    return (
        <div className="flex gap-8 ">
            {FILTERS.map((filter) => (
                <p
                    key={filter}
                    className={` px-4 py-2 rounded-md cursor-pointer transition-all duration-200 ${selectedFilter === filter ? 'bg-zinc-400' : 'bg-zinc-800/70 hover:bg-zinc-500/50'}`}
                    onClick={() => select(filter)}
                >
                    {filter}
                </p>
            ))}
        </div>
    );
};

export default Filters;
