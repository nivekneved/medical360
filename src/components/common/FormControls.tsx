import React from 'react';
import { AlertCircle } from 'lucide-react';
import './FormControls.css';

export interface FormFieldProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function FormField({
  label,
  hint,
  error,
  required,
  children,
  className = '',
  id,
}: FormFieldProps) {
  return (
    <div className={`form-field ${className}`.trim()}>
      {(label || hint) && (
        <div className="form-field__label-row">
          {label && (
            <label htmlFor={id} className="form-field__label">
              {label}
              {required && <span className="form-field__required">*</span>}
            </label>
          )}
          {hint && <span className="form-field__hint">{hint}</span>}
        </div>
      )}
      {children}
      {error && (
        <div className="form-field__error" role="alert">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`input-base ${error ? 'input-base--error' : ''} ${className}`.trim()}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`input-base ${error ? 'input-base--error' : ''} ${className}`.trim()}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`input-base ${error ? 'input-base--error' : ''} ${className}`.trim()}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';
