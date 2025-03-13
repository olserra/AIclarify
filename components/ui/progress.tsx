'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

// Validation functions
function isValidNumber(value: number): boolean {
  return typeof value === 'number' && !isNaN(value);
}

function isValidMaxValue(value: number): boolean {
  return isValidNumber(value) && value > 0;
}

function isValidProgressValue(value: number | null, max: number): boolean {
  return value === null || (isValidNumber(value) && value >= 0 && value <= max);
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, max = 100, ...props }, ref) => {
  // Validate max value
  const validMax = isValidMaxValue(max) ? max : 100;

  // Validate and normalize progress value
  const progressValue = isValidProgressValue(value as number | null, validMax)
    ? ((value as number) / validMax) * 100
    : 0;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - progressValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
