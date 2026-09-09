import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium transition-all duration-150 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-border-strong disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const sizeStyles = {
      sm: "text-xs py-1.5 px-2.5 gap-1.5",
      md: "text-sm py-2 px-3.5 gap-2",
      lg: "text-base py-2.5 px-4 gap-2.5",
    };

    const variantStyles = {
      // Background #111111, teks putih, hover #2A2A2A, active scale 0.98, no shadow
      primary:
        "bg-inverse-bg text-inverse-text border border-border-strong hover:bg-[#2A2A2A] active:scale-[0.98]",
      // Background transparan, border 1px solid var(--border-strong), teks text-primary
      secondary:
        "bg-transparent text-text-primary border border-border-strong hover:bg-surface active:scale-[0.98]",
      ghost:
        "bg-transparent text-text-primary hover:bg-surface border border-transparent active:scale-[0.98]",
      // Destructive: teks merah-abu bukan merah cerah, border halus
      destructive:
        "bg-transparent text-[#5A5A5A] border border-border hover:bg-[#F2F2F2] hover:text-text-primary hover:border-border-strong active:scale-[0.98]",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
