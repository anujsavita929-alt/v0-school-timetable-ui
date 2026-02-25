import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  height?: string;
  variant?: 'card' | 'text' | 'avatar';
}

export function LoadingSkeleton({
  count = 1,
  height = 'h-4',
  variant = 'text',
}: LoadingSkeletonProps) {
  const getSkeletonClass = () => {
    switch (variant) {
      case 'card':
        return 'rounded-2xl h-48 mb-4';
      case 'avatar':
        return 'rounded-full w-12 h-12';
      default:
        return `rounded ${height}`;
    }
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-200 animate-pulse ${getSkeletonClass()}`}
        ></div>
      ))}
    </div>
  );
}
