import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function Button({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  fullWidth = true,
  ...props 
}: ButtonProps) {
  const baseClasses = 'flex justify-center border border-transparent rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors';

  const variantClasses = {
    primary: 'text-white bg-indigo-600 hover:bg-indigo-700',
    secondary: 'text-indigo-400 bg-gray-700 hover:bg-gray-600 border-gray-600',
  };

  const sizeClasses = {
    sm: 'py-1 px-3 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-6 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
