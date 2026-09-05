import Image from 'next/image';
import React from 'react';

const Header = () => {
    return (
        <div className="flex justify-between items-center px-10 py-3 dark:bg-zinc-800/90">
            <a href="#" className="text-3xl font-bold tracking-wider font-sans">
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
