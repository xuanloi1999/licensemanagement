
import React from 'react';

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}> = ({ children, onClick, variant = 'primary', className = '', disabled, type = 'button' }) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary-500',
    outline: 'border border-neutral-300 text-neutral-300 hover:bg-neutral-800',
    ghost: 'text-neutral-300 hover:bg-neutral-800',
    danger: 'bg-error text-white hover:bg-error-700 focus:ring-error-500',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-background-darker border border-neutral-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

export const Input: React.FC<{
  label?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}> = ({ label, type = 'text', value, onChange, placeholder, className = '' }) => (
  <div className={`w-full ${className}`}>
    {label && <label className="block text-xs font-medium text-neutral-400 mb-1">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-primary transition-colors"
    />
  </div>
);

export const Progress: React.FC<{ value: number; total: number; color?: string; label?: string }> = ({ value, total, color = 'bg-primary', label }) => {
  const percentage = Math.min((value / total) * 100, 100);
  const isCritical = percentage >= 90;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-xs">
        <span className="text-neutral-400 font-medium">{label}</span>
        <span className={`${isCritical ? 'text-error' : 'text-neutral-300'}`}>
          {value} / {total} ({Math.round(percentage)}%)
        </span>
      </div>
      <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${isCritical ? 'bg-error' : color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-background-darker border border-neutral-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <h2 className="text-xl font-display font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="p-5 bg-neutral-900/50 border-t border-neutral-800 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const Badge: React.FC<{ status: string; className?: string }> = ({ status, className = '' }) => {
  const colors: Record<string, string> = {
    active: 'bg-success/10 text-success border-success/20',
    expired: 'bg-error/10 text-error border-error/20',
    suspended: 'bg-warning/10 text-warning border-warning/20',
    pending: 'bg-process/10 text-process border-process/20',
  };

  return (
    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${colors[status.toLowerCase()] || 'bg-neutral-800 text-neutral-400 border-neutral-700'} ${className}`}>
      {status}
    </span>
  );
};
