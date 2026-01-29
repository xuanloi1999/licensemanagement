
import React, { forwardRef } from 'react';

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}> = ({ children, onClick, variant = 'primary', className = '', disabled, type = 'button' }) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg shadow-primary/20',
    secondary: 'bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary-500 shadow-lg shadow-secondary/20',
    outline: 'border border-neutral-300 text-neutral-300 hover:bg-neutral-800',
    ghost: 'text-neutral-300 hover:bg-neutral-800',
    danger: 'bg-error text-white hover:bg-error-700 focus:ring-error-500 shadow-lg shadow-error/20',
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

export const Card: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-background-darker border border-neutral-800 rounded-lg shadow-lg overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-primary/5 transition-all duration-300' : ''} ${className}`}
  >
    {children}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => (
  <div className={`w-full ${className}`}>
    {label && <label className="block text-[10px] font-bold text-neutral-500 mb-2 uppercase tracking-widest">{label}</label>}
    <input
      ref={ref}
      {...props}
      className={`w-full bg-neutral-900 border ${error ? 'border-error/50 focus:border-error' : 'border-neutral-800 focus:border-primary'} rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 ${error ? 'focus:ring-error/20' : 'focus:ring-primary/20'} transition-all font-medium shadow-inner`}
    />
    {error && <p className="mt-1.5 text-[10px] text-error font-bold uppercase tracking-wider animate-fade-in">{error}</p>}
  </div>
));

export const Progress: React.FC<{ value: number; total: number; color?: string; label?: string; className?: string }> = ({ value, total, color = 'bg-primary', label, className = '' }) => {
  const percentage = Math.min((value / total) * 100, 100);
  const isCritical = percentage >= 90;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2.5 text-xs">
        <span className="text-neutral-500 font-bold uppercase tracking-[0.2em] text-[9px]">{label}</span>
        <span className={`${isCritical ? 'text-error font-bold' : 'text-neutral-400 font-mono text-[10px]'}`}>
          {value} <span className="text-neutral-600">/</span> {total} <span className="ml-1 opacity-60">({Math.round(percentage)}%)</span>
        </span>
      </div>
      <div className="w-full bg-neutral-900 rounded-full h-2.5 overflow-hidden border border-neutral-800 shadow-inner">
        <div
          className={`h-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(236,25,56,0.3)] ${isCritical ? 'bg-error' : color}`}
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
  size?: 'md' | 'lg' | 'xl' | '4xl' | '5xl';
}> = ({ isOpen, onClose, title, children, footer, size = '4xl' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className={`bg-background-darker border border-neutral-800 rounded-[2.5rem] w-full ${sizeClasses[size]} shadow-2xl overflow-hidden flex flex-col max-h-[95vh] shadow-primary/10 border-white/5 relative`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="flex items-center justify-between p-8 border-b border-neutral-800/60 bg-neutral-900/30">
          <h2 className="text-2xl font-display font-bold text-white tracking-tight uppercase italic">{title}</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-all p-2.5 hover:bg-neutral-800 rounded-2xl border border-transparent hover:border-neutral-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-10 overflow-y-auto custom-scrollbar">
          {children}
        </div>
        {footer && (
          <div className="p-8 bg-neutral-950/80 border-t border-neutral-800/60 flex justify-end gap-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const Badge: React.FC<{ status: string; className?: string }> = ({ status, className = '' }) => {
  const colors: Record<string, string> = {
    active: 'bg-success/10 text-success border-success/20 shadow-success/5',
    expired: 'bg-error/10 text-error border-error/20 shadow-error/5',
    suspended: 'bg-warning/10 text-warning border-warning/20 shadow-warning/5',
    pending: 'bg-process/10 text-process border-process/20 shadow-process/5',
  };

  return (
    <span className={`px-4 py-1 rounded-full text-[10px] uppercase font-bold border tracking-[0.2em] shadow-sm ${colors[status.toLowerCase()] || 'bg-neutral-800 text-neutral-400 border-neutral-700'} ${className}`}>
      {status}
    </span>
  );
};
