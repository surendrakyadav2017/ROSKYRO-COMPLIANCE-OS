/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  id,
  type = 'button',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#1E3A5F] text-white hover:bg-[#152a45] active:bg-[#0c182b] focus:ring-2 focus:ring-[#1E3A5F]/20';
      case 'accent':
        return 'bg-[#F97316] text-white hover:bg-[#ea580c] active:bg-[#c2410c] focus:ring-2 focus:ring-[#F97316]/20';
      case 'secondary':
        return 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-2 focus:ring-slate-200';
      case 'success':
        return 'bg-[#0F766E] text-white hover:bg-[#0d635c] active:bg-[#0a4e48] focus:ring-2 focus:ring-[#0F766E]/20';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-500/20';
      case 'outline':
        return 'bg-transparent text-[#1E3A5F] border border-[#1E3A5F] hover:bg-[#1E3A5F]/5';
      case 'ghost':
        return 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900';
      default:
        return 'bg-[#1E3A5F] text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs font-medium rounded-md';
      case 'lg':
        return 'px-6 py-3 text-base font-semibold rounded-lg';
      case 'md':
      default:
        return 'px-4 py-2 text-sm font-semibold rounded-lg';
    }
  };

  return (
    <button
      id={id}
      type={type}
      className={`inline-flex items-center justify-center transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
