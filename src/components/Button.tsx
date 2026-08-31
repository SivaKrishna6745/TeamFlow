import React from 'react';

type ButtonProps = {
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
    className?: string;
    label: string;
    onClick?: () => void;
};

const Button = ({ type = 'button', className, label, onClick }: ButtonProps) => {
    return (
        <button type={type} className={`cursor-pointer ${className}`} onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;
