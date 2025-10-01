'use client';

import React, { useMemo, useState } from 'react';
import { useEncryption } from '@/lib/encryption/EncryptionService';

interface SecureFieldProps {
  value: string | number;
  field: string;
  className?: string;
  showToggle?: boolean;
  placeholder?: string;
}

export function SecureField({ 
  value, 
  field, 
  className = '', 
  showToggle = true, 
  placeholder = '••••••••' 
}: SecureFieldProps) {
  const { decrypt } = useEncryption();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const displayValue = useMemo(() => {
    if (typeof value === 'string') {
      try {
        return decrypt(value);
      } catch {
        return value; // Si no está encriptado, mostrar tal como está
      }
    }
    return value;
  }, [value, decrypt]);

  const shouldMask = !isVisible && !isHovered;

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="secure-field">
        {shouldMask ? placeholder : displayValue}
      </span>
      
      {showToggle && (
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="absolute -right-6 top-0 h-full flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          title={isVisible ? 'Ocultar' : 'Mostrar'}
        >
          {isVisible ? '👁️' : '👁️‍🗨️'}
        </button>
      )}
    </div>
  );
}

interface SecureInputProps {
  value: string | number;
  onChange: (value: string) => void;
  field: string;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'number' | 'password';
}

export function SecureInput({ 
  value, 
  onChange, 
  field, 
  placeholder = '', 
  className = '',
  type = 'text'
}: SecureInputProps) {
  const { encrypt, decrypt } = useEncryption();
  const [isVisible, setIsVisible] = React.useState(false);
  const [localValue, setLocalValue] = React.useState('');

  React.useEffect(() => {
    if (typeof value === 'string') {
      try {
        setLocalValue(decrypt(value));
      } catch {
        setLocalValue(value); // Si no está encriptado, usar tal como está
      }
    } else {
      setLocalValue(value.toString());
    }
  }, [value, decrypt]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    const encrypted = encrypt(newValue);
    onChange(encrypted);
  };

  return (
    <div className="relative">
      <input
        type={isVisible ? type : 'password'}
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={`${className} pr-8`}
      />
      <button
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        title={isVisible ? 'Ocultar' : 'Mostrar'}
      >
        {isVisible ? '👁️' : '👁️‍🗨️'}
      </button>
    </div>
  );
}

interface SecureTableProps {
  data: Array<Record<string, any>>;
  sensitiveFields: string[];
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
}

export function SecureTable({ data, sensitiveFields, columns }: SecureTableProps) {
  const { decrypt } = useEncryption();

  const renderValue = (value: any, field: string) => {
    if (sensitiveFields.includes(field)) {
      return <SecureField value={value} field={field} />;
    }
    return value;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                >
                  {column.render 
                    ? column.render(row[column.key], row)
                    : renderValue(row[column.key], column.key)
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
