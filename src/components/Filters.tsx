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
                    className={`px-3 py-1 border-b-2 cursor-pointer transition-all duration-200 ${selectedFilter === filter ? 'border-zinc-400' : 'border-zinc-800/70 hover:border-zinc-500/50'}`}
                    onClick={() => select(filter)}
                >
                    {filter}
                </p>
            ))}
        </div>
    );
};

export default Filters;
