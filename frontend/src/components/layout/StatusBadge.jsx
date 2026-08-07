export default function StatusBadge({
  label,
  color,
}) {
  return (
    <div
      className={`
        inline-flex
        items-center
        gap-2
        px-3
        py-1.5
        rounded-full
        text-xs
        font-medium
        ${color}
      `}
    >
      <span className="w-2 h-2 rounded-full bg-current" />

      {label}
    </div>
  )
}