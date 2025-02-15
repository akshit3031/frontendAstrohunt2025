import React from "react";
import { cn } from "../../lib/utils"; // Assuming 'cn' function is already imported

// Card Component
const Card = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...rest}
    />
  );
});
Card.displayName = "Card";

// CardHeader Component
const CardHeader = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...rest}
    />
  );
});
CardHeader.displayName = "CardHeader";

// CardTitle Component
const CardTitle = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...rest}
    />
  );
});
CardTitle.displayName = "CardTitle";

// CardDescription Component
const CardDescription = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...rest}
    />
  );
});
CardDescription.displayName = "CardDescription";

// CardContent Component
const CardContent = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...rest} />
  );
});
CardContent.displayName = "CardContent";

// CardFooter Component
const CardFooter = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...rest}
    />
  );
});
CardFooter.displayName = "CardFooter";

// Export all components
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
