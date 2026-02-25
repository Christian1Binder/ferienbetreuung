import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={twMerge(clsx('bg-white rounded-xl shadow-sm border border-gray-100 p-6', className))}
      {...props}
    >
      {children}
    </div>
  );
}
