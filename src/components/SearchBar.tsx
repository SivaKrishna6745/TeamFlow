import React from 'react';

interface SearchBarProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
    return (
        <div className="flex items-center gap-2">
            <label htmlFor="search" className="text-xs uppercase tracking-wide text-zinc-400">
                Search:
            </label>
            <input
                type="search"
                id="search"
                name="search"
                placeholder="Search for a task..."
                value={value}
                onChange={onChange}
                className="border border-zinc-500 rounded-full px-3 py-1 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-400 min-w-md placeholder:text-sm placeholder:tracking-wider"
            />
        </div>
    );
};

export default SearchBar;
