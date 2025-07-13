import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = "w-32 h-12 rounded-lg font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantStyles = {
    primary: "bg-portfolio-green-600 text-white hover:bg-portfolio-green-700 focus:ring-portfolio-green-500",
    secondary: "bg-white text-portfolio-green-600 border border-portfolio-green-600 hover:bg-portfolio-green-50 focus:ring-portfolio-green-500"
  };

  const widthStyle = fullWidth ? "w-full" : "w-32";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 