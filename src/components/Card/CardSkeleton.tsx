import React from "react";

type CardSkeletonProps = {
  variant?: "default" | "summary";
};

const CardSkeleton = ({ variant = "default" }: CardSkeletonProps) => {
  return (
    <div className='relative animate-pulse'>
      <div>
        <div className='rounded-lg overflow-hidden aspect-square bg-gray-100' />
        <div className='mt-2 space-y-2'>
          <div className='h-3 w-16 bg-gray-100 rounded' />
          <div
            className={`h-4 bg-gray-100 rounded ${
              variant === "summary" ? "w-32" : "w-40"
            }`}
          />
          <div className='mt-1 h-4 w-24 bg-gray-100 rounded' />
        </div>
      </div>

      <div className='absolute flex items-center justify-center top-0 right-0 w-12 h-12 lg:w-16 lg:h-16'>
        <div className='w-6 h-6 rounded-full bg-gray-100' />
      </div>

      {variant !== "summary" && (
        <div className='mt-2 h-4 w-24 bg-gray-100 rounded' />
      )}
    </div>
  );
};

export default React.memo(CardSkeleton);
