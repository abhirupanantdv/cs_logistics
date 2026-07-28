import { Loader2 } from 'lucide-react'

export default function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  icon = null,
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        h-10
        px-4
        rounded-lg
        bg-[#006B82]
        hover:bg-[#005a6a]
        text-white
        flex
        items-center
        justify-center
        gap-2
        text-xs
        font-semibold
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? (
        <Loader2
          size={16}
          className="animate-spin"
        />
      ) : (
        icon
      )}

      {children}
    </button>
  )
}