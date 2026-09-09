import React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, hint, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-text-secondary"
          >
            {label}
            {props.required && <span className="text-text-primary ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`w-full bg-bg text-text-primary text-sm px-3 py-2.5 rounded-[6px] border border-border placeholder:text-text-muted focus:border-border-strong focus:ring-1 focus:ring-border-strong focus:outline-none transition-colors ${
            error ? "border-border-strong" : ""
          } ${className}`}
          rows={props.rows || 4}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-text-muted">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-text-primary font-medium tracking-tight">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
