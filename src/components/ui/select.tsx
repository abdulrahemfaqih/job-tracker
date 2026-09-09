import React from "react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, error, hint, id, options, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-text-secondary"
          >
            {label}
            {props.required && <span className="text-text-primary ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full bg-bg text-text-primary text-sm px-3 py-2.5 rounded-[6px] border border-border focus:border-border-strong focus:ring-1 focus:ring-border-strong focus:outline-none transition-colors cursor-pointer ${
            error ? "border-border-strong" : ""
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
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

Select.displayName = "Select";
