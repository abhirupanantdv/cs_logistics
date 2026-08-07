//JobCardRow.jsx
import {
  Truck,
  User,
  Calendar,
  ChevronRight,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

export default function JobCardRow({
  item,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex min-h-[155px]">
        {/* Left Accent */}
        <div
          className="w-1"
          style={{
            background: item.accent,
          }}
        />

        {/* Job Card */}
        <div className="w-[280px] flex items-center gap-5 p-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
            <item.icon
              size={34}
              color={item.accent}
            />
          </div>

          <div>
            <h3 className="text-[16px] font-bold text-[#04587B]">
              {item.jobNo}
            </h3>

            <div className="mt-3">
              <StatusBadge
                label={item.status}
                color={item.statusColor}
              />
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="w-[180px] border-l border-slate-200 flex items-center px-6 font-semibold text-slate-800">
          {item.customer}
        </div>

        {/* Containers */}
        <div className="w-[280px] border-l border-slate-200 p-5">
          {item.containers.map((c) => (
            <div
              key={c.no}
              className="flex justify-between text-[11px] py-1"
            >
              <span>{c.no}</span>
              <span>{c.type}</span>
            </div>
          ))}
        </div>

        {/* Fleet */}
        <div className="w-[220px] border-l border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <Truck size={16} />
            {item.truck}
          </div>

          <div className="flex items-center gap-3">
            <User size={16} />
            {item.driver}
          </div>
        </div>

        {/* Invoice */}
        <div className="flex-1 border-l border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={15} />

            {item.invoiceDate}
          </div>

          <div className="text-xl font-semibold text-[#0B2257]">
            PGK {item.amount}
          </div>

          <div className="mt-3">
            <StatusBadge
              label={item.invoiceStatus}
              color={
                item.invoiceStatus === "Paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-600"
              }
            />
          </div>
        </div>

        {/* Arrow */}
        <div className="w-[80px] flex items-center justify-center border-l border-slate-200">
          <button className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center">
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}