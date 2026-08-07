import { Loader2 } from 'lucide-react'

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  icon = null,
  className = '',
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#006B82] hover:bg-[#00596c] text-white shadow-sm',
    secondary: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    ghost: 'hover:bg-slate-100 text-slate-600',
    outline: 'border border-[#006B82] text-[#006B82] hover:bg-[#006B82]/10',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-lg',
    md: 'h-10 px-4 text-xs md:text-sm rounded-xl',
    lg: 'h-12 px-6 text-sm md:text-base rounded-xl',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {loading ? (
        <Loader2
          size={size === 'sm' ? 14 : 16}
          className="animate-spin"
        />
      ) : (
        icon
      )}

      {children}
    </button>
  )
}