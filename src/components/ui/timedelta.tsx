import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface TimedeltaProps extends React.HTMLAttributes<HTMLTimeElement> {
  dateTime: Date;
}

const Timedelta = React.forwardRef<HTMLTimeElement, TimedeltaProps>(
  ({ className, dateTime, children, ...props }, ref) => {
    const formattedRelativeTime = formatDistanceToNow(dateTime, {
      addSuffix: true,
    });

    return (
      <time
        ref={ref}
        className={cn(
          "text-sm text-gray-500 whitespace-nowrap text-ellipsis overflow-hidden",
          className
        )}
        {...props}
      >
        {formattedRelativeTime}
      </time>
    );
  }
);

export default Timedelta;
