//StatCard.jsx
export default function StatCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className="flex items-center gap-4">

        <div
          className={`
            flex
            h-9
            w-9
            rounded-lg
            shrink-0
            items-center
            justify-center
            
            ${iconBg}
          `}
        >
          <Icon
            className={`h-5 w-5 ${iconColor}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase truncate">
            {title}
          </p>

          <h3 className="mt-0.5 text-lg font-bold text-slate-900 leading-tight">
            {value}
          </h3>
        </div>

      </div>
    </div>
  )
}