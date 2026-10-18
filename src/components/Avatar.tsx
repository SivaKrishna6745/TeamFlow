import { User } from '@/types';
import React from 'react';

interface AvatarProps {
    assignee: User;
}

const AvatarColors: string[] = [
    'border-violet-300 text-violet-300 bg-violet-600/20',
    'border-blue-300 text-blue-300 bg-blue-600/20',
    'border-teal-300 text-teal-300 bg-teal-600/20',
    'border-green-300 text-green-300 bg-green-600/20',
    'border-amber-300 text-amber-300 bg-amber-600/20',
    'border-rose-300 text-rose-300 bg-rose-600/20',
    'border-orange-300 text-orange-300 bg-orange-600/20',
    'border-sky-300 text-sky-300 bg-sky-600/20',
    'border-pink-300 text-pink-300 bg-pink-600/20',
    'border-slate-300 text-slate-300 bg-slate-600/20',
];

function hashString(value: string): number {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = (hash * 31 + value.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
}

const Avatar = ({ assignee }: AvatarProps) => {
    const avatarContent =
        assignee.name
            .trim()
            .split(' ')
            .slice(0, 2)
            .reduce((acc, word) => acc + word[0].toUpperCase(), '') ?? 'UU';
    const colorIndex = hashString(assignee.userId) % AvatarColors.length;
    const color = AvatarColors[colorIndex] ?? 'border-stone-300 text-stone-300 bg-stone-600/20';

    return (
        <div
            className={`h-7 w-7 shrink-0 rounded-full border text-xs tracking-wide flex items-center justify-center ${color}`}
        >
            {avatarContent}
        </div>
    );
};

export default Avatar;
