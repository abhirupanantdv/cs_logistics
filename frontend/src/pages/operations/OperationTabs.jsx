//OperationTabs.jsx
import {
  ClipboardList,
  Truck,
  TruckIcon,
  Receipt,
  FileCheck,
  FileSpreadsheet,
} from 'lucide-react'

const iconMap = {
  'Gate In': Truck,
  'Gate Out': TruckIcon,
  Quotation: ClipboardList,
  'Pickup Docket': Truck,
  'Delivery Docket': Truck,
  'Sales Invoice': Receipt,
  'Equipment Interchange Receipt': FileCheck,
}

export default function OperationTabs({
  operations = [],
  activeTab,
  onTabChange,
}) {
  return (
    <div
      className="
        bg-slate-100/80
        p-1.5
        rounded-xl
        flex
        items-center
        gap-1.5
        overflow-x-auto
        scrollbar-none
        mb-6
      "
    >
      {operations.map((item) => {
        const Icon = iconMap[item.name] || FileSpreadsheet
        const active = activeTab === item.name

        return (
          <button
            key={item.name}
            type="button"
            onClick={() => onTabChange(item.name)}
            className={`
              flex
              items-center
              gap-2.5
              px-4
              py-2
              text-xs
              font-bold
              uppercase
              tracking-wider
              rounded-lg
              transition-all
              duration-200
              whitespace-nowrap
              shrink-0
              ${
                active
                  ? 'bg-[#006B82] text-white shadow-sm shadow-[#006B82]/20'
                  : 'text-slate-600 hover:text-[#0B2257] hover:bg-white/60'
              }
            `}
          >
            <Icon size={14} className={active ? 'text-white' : 'text-slate-400'} />
            {item.name}
          </button>
        )
      })}
    </div>
  )
}