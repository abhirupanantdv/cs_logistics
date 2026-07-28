
//Navbar.jsx
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";

import { getFileUrl } from "@/config/constants";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar({
  title,
  description,
  variant = "app",
  setSidebarOpen,
}) {
  const { user } = useAuth();

  const initials =
    user?.full_name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  // LOGIN PAGE NAVBAR
  if (variant === "auth") {
    return (
      <header className="bg-white border-b border-slate-200">
        {/* ... */}
      </header>
    );
  }

  // APPLICATION NAVBAR
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">

  <button
    onClick={() =>
      setSidebarOpen(true)
    }
    className="
      xl:hidden
      p-2
      rounded-lg
      hover:bg-slate-100
    "
  >
    <Menu size={18} />
  </button>

  <div>
    <h1
      className="
        text-base
        md:text-lg
        font-bold
        text-[#0B2257]
        leading-tight
      "
    >
      {title}
    </h1>

    <p
      className="
        hidden
        md:block
        text-xs
        text-slate-500
      "
    >
      {description}
    </p>
  </div>

</div>

        {/* Right */}
        <div className="flex items-center gap-5">
          {/* <Search size={18} className="text-[#0B2257] cursor-pointer" /> */}

          {/* <div className="relative">
            <Bell size={22} className="text-[#0B2257] cursor-pointer" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />
          </div> */}

          <div className="h-8 w-px bg-slate-200" />

          <div className="flex items-center gap-3 cursor-pointer">
            <div
              className="
                w-8 h-8 rounded-full
                bg-[#006B82]
                text-white
                flex items-center justify-center
                font-semibold text-xs
              "
            >
              {initials}
            </div>

            <div>
              <div className="text-[10px] text-slate-500">
                Welcome,
              </div>

              <div className="font-semibold text-[13px] text-[#0B2257]">
                {user?.full_name || "User"}
              </div>
            </div>

            {/* <ChevronDown
              size={14}
              className="text-[#0B2257]"
            /> */}
          </div>
        </div>
      </div>
    </header>
  );
}