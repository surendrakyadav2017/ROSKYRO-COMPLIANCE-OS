/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`bg-slate-200 animate-pulse rounded-md ${className}`}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  );
};
