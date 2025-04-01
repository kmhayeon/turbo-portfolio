'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

const Button = ({ label, className = '', ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`px-5 py-2 rounded-md bg-blue-600 text-white font-medium 
        hover:bg-blue-700 active:scale-95 transition 
        disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
