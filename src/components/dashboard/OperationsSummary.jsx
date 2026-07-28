//OperationsSummary.jsx
import {
  Truck,
  Warehouse,
  ClipboardList,
  FileText,
  FileCheck,
  PackageCheck,
  Package,
} from 'lucide-react'

const getOperationConfig = (name) => {
  switch (name) {
    case 'Gate Out':
      return {
        icon: Truck,
        bg: 'bg-green-100',
        color: 'text-green-600',
      }

    case 'Gate In':
      return {
        icon: Warehouse,
        bg: 'bg-blue-100',
        color: 'text-blue-600',
      }

    case 'Quotation':
      return {
        icon: ClipboardList,
        bg: 'bg-orange-100',
        color: 'text-orange-600',
      }

    case 'Sales Invoice':
      return {
        icon: FileText,
        bg: 'bg-purple-100',
        color: 'text-purple-600',
      }

    case 'Equipment Interchange Receipt':
      return {
        icon: FileCheck,
        bg: 'bg-teal-100',
        color: 'text-teal-600',
      }

    case 'Pickup Docket':
      return {
        icon: Package,
        bg: 'bg-pink-100',
        color: 'text-pink-600',
      }

    case 'Delivery Docket':
      return {
        icon: PackageCheck,
        bg: 'bg-yellow-100',
        color: 'text-yellow-600',
      }

    default:
      return {
        icon: ClipboardList,
        bg: 'bg-slate-100',
        color: 'text-slate-600',
      }
  }
}

export default function OperationsSummary({
  data = [],
}) {
  const total = data.reduce(
    (sum, item) => sum + item.count,
    0
  )

  const sortedData = [...data].sort(
    (a, b) => b.count - a.count
  )

  return (
    <div
  className="
    h-full
    flex
    flex-col
    rounded-2xl
    border
    border-slate-200
    bg-white
    p-4
    shadow-sm
  "
>

      <div className="mb-2">
        <h3 className="text-sm font-semibold text-slate-900">
          Operations Summary
        </h3>

        {/* <p className="mt-0.5 text-xs text-slate-500">
          Documents processed across logistics operations
        </p> */}
      </div>

      <div
  className="
    flex-1
    overflow-y-auto max-h-[320px]
    space-y-1
    pr-1
  "
>

        {sortedData.map((item) => {
          const config =
            getOperationConfig(item.name)

          const Icon =
            config.icon

          return (
            <div
              key={item.name}
              className="
flex
items-center
justify-between
rounded-lg
border
border-slate-100
px-2
py-1.5
hover:bg-slate-50
transition
"
            >
              <div className="flex items-center gap-2">

                <div
  className={`
    flex
    h-7
    w-7
    items-center
    justify-center
    rounded-md
    ${config.bg}
  `}
>
  <Icon
    size={13}
    className={config.color}
  />
</div>

                <div>
                  <p className="text-xs font-medium text-slate-700">
                    {item.name}
                  </p>
                </div>

              </div>

              <div className="text-sm font-semibold text-[#101E68]">
                {item.count}
              </div>
            </div>
          )
        })}

      </div>

      {/* <div className="mt-2 border-t pt-2"> */}

        {/* <div className="flex items-center justify-between">

          <span className="text-xs font-medium text-slate-600">
            Total Operations
          </span>

          <span className="text-lg font-bold text-[#101E68]">
            {total}
          </span>

        </div> */}

      {/* </div> */}

    </div>
  )
}