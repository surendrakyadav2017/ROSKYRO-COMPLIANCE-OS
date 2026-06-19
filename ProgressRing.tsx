/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ProgressRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  score,
  size = 40,
  strokeWidth = 4,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return 'stroke-[#0F766E]'; // success teal
    if (score >= 60) return 'stroke-[#F97316]'; // accent orange
    return 'stroke-red-600'; // overdue/danger alert
  };

  const getBgColor = () => {
    if (score >= 80) return 'stroke-[#0F766E]/10';
    if (score >= 60) return 'stroke-[#F97316]/10';
    return 'stroke-red-100';
  };

  const getTextColor = () => {
    if (score >= 80) return 'text-[#0F766E]';
    if (score >= 60) return 'text-[#F97316]';
    return 'text-red-600';
  };

  return (
    <div className="relative inline-flex items-center justify-center font-sans select-none">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          className={getBgColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Colored progress circle */}
        <circle
          className={`${getColor()} transition-all duration-300`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Percentage Center Text */}
      <span className={`absolute text-[10px] font-bold font-mono tracking-tighter ${getTextColor()}`}>
        {score}%
      </span>
    </div>
  );
};
