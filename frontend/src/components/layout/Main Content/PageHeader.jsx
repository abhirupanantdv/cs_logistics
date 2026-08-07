import {
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

export default function PageHeader({
  title,
  description,
}) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="px-8 py-6 flex items-start justify-between">
        {/* Left */}

        <div>
          <h1 className="text-[28px] font-bold text-[#0B2257]">
            {title}
          </h1>

          <p className="mt-2 text-[15px] text-slate-500">
            {description}
          </p>
        </div>

        {/* Right */}

        <div className="flex items-center gap-8">
          <Search
            size={24}
            className="text-[#0B2257] cursor-pointer"
          />

          <div className="relative">
            <Bell
              size={24}
              className="text-[#0B2257] cursor-pointer"
            />

            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500" />
          </div>

          <div className="h-10 w-px bg-slate-200" />

          <div className="flex items-center gap-4 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-[#006B82] text-white flex items-center justify-center font-semibold text-lg">
              SD
            </div>

            <div>
              <div className="text-xs text-slate-500">
                Welcome,
              </div>

              <div className="font-semibold text-[#0B2257]">
                Shawn D.
              </div>
            </div>

            <ChevronDown
              size={18}
              className="text-[#0B2257]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}