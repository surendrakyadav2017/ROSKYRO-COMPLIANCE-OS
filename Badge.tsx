/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'neutral';
  className?: string;
  id?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  id,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#1E3A5F]/10 text-[#1E3A5F] border-[#1E3A5F]/20';
      case 'secondary':
        return 'bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20';
      case 'danger':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'success':
        return 'bg-[#0F766E]/10 text-[#0F766E] border-[#0F766E]/20';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'neutral':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      id={id}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getColors()} ${className}`}
    >
      {children}
    </span>
  );
};
