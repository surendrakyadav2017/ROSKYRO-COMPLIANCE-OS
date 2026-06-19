/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  id,
  hoverEffect = false,
}) => {
  return (
    <div
      id={id}
      className={`bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ${
        hoverEffect ? 'hover:shadow-md hover:border-slate-300 transition-all duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`p-5 border-b border-[#E2E8F0] ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`p-4 bg-slate-50 border-t border-[#E2E8F0] rounded-b-xl ${className}`}>
    {children}
  </div>
);
