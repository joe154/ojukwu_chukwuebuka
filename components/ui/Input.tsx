'use client';

import React, { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, size = 'md', icon, iconPosition = 'left', className = '', ...props }, ref) => {
    const sizeClasses = {
      sm: 'input-sm',
      md: 'input',
      lg: 'input px-5 py-3',
    };

    const inputClass = `${sizeClasses[size]} ${error ? 'input-error' : ''} ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''} ${className}`.trim();

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-slate-200">
            {label}
            {props.required && <span className="text-rose-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className={`absolute top-1/2 -translate-y-1/2 ${iconPosition === 'left' ? 'left-3' : 'right-3'} text-slate-400 flex items-center justify-center`}>
              {icon}
            </div>
          )}
          <input ref={ref} className={inputClass} {...props} />
        </div>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        {hint && !error && <p className="text-sm text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-slate-200">
            {label}
            {props.required && <span className="text-rose-400 ml-1">*</span>}
          </label>
        )}
        <textarea ref={ref} className={`textarea ${error ? 'input-error' : ''} ${className}`.trim()} {...props} />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        {hint && !error && <p className="text-sm text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-slate-200">
            {label}
            {props.required && <span className="text-rose-400 ml-1">*</span>}
          </label>
        )}
        <select ref={ref} className={`select ${error ? 'input-error' : ''} ${className}`.trim()} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        {hint && !error && <p className="text-sm text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            className={`w-5 h-5 rounded border-slate-700 bg-slate-800 text-primary-500 cursor-pointer accent-primary-500 ${error ? 'border-rose-500' : ''} ${className}`.trim()}
            {...props}
          />
          <span className="text-sm text-slate-300">{label}</span>
        </label>
        {error && <p className="text-sm text-rose-400">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
