import React from 'react';

type ButtonProps = {
    className?: string;
    label: string;
    onClick?: () => void;
};

const Button = ({ className, label, onClick }: ButtonProps) => {
    return (
        <button className={`cursor-pointer ${className}`} onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;
