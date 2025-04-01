'use client'

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

const Button = ({ label, className = '', ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`rounded-md bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-400 ${className}`}
    >
      {label}
    </button>
  )
}

export default Button
