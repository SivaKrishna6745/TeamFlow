import Image from 'next/image';
import React from 'react';

const Header = () => {
    return (
        <div className="flex justify-between items-center px-10 dark:bg-white/40">
            <a href="#" className="text-2xl font-bold tracking-wide font-mono">
                TeamFlow
            </a>
            <Image
                height={50}
                width={50}
                src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png"
                alt="profile avatar"
            />
        </div>
    );
};

export default Header;
