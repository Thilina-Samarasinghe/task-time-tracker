import React from 'react';

interface CustomLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export const CustomLabel: React.FC<CustomLabelProps> = ({
  htmlFor,
  children,
  className = '',
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
    </label>
  );
};