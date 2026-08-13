import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white border border-primary/20 shadow-lg shadow-primary/10',
    secondary: 'bg-transparent hover:bg-surface-700 text-slate-300 border border-border hover:border-border',
    ghost: 'bg-transparent hover:bg-surface-700 text-slate-400 hover:text-slate-200 border border-transparent',
    danger: 'bg-rose-dim hover:bg-rose/20 text-rose border border-rose/20',
  }
  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-lg',
    md: 'text-sm px-4 py-2 rounded-xl',
    lg: 'text-sm px-6 py-2.5 rounded-xl',
  }

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
