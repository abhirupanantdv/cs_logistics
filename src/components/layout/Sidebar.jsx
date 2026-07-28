//Sidebar.jsx
import {
  Home,
  Package,
  ClipboardList,
  BarChart3,
  Users,
  UserCheck,
  Truck,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth'

const menuItems = [
  {
    label: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    label: "Containers",
    icon: Package,
    path: "/containers",
  },
  {
    label: "Job Cards",
    icon: ClipboardList,
    path: "/job-cards",
  },
  {
    label: "Operations",
    icon: BarChart3,
    path: "/operations",
  },
  {
    label: "Customers",
    icon: Users,
    path: "/customers",
  },
  {
    label: "Drivers",
    icon: UserCheck,
    path: "/drivers",
  },
  {
    label: "Fleet",
    icon: Truck,
    path: "/fleet",
  },
];

export default function Sidebar({sidebarOpen,
  setSidebarOpen,}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth()

  const handleLogout = async () => {
  try {
    await logout();

    setSidebarOpen(false);

    navigate("/login", {
      replace: true,
    });
  } catch (error) {
    console.error(error);
  }
};

  return (
    <aside
  className={`
    fixed xl:static
    left-0 top-0 z-50

    h-screen

    w-[240px]
    xl:w-[220px]

    bg-[#002c3e]
    text-white

    transform
    transition-transform
    duration-300

    ${
      sidebarOpen
        ? "translate-x-0"
        : "-translate-x-full xl:translate-x-0"
    }

    flex
    flex-col
    border-r
    border-[#0d435a]
  `}
>
      {/* Logo */}
      <div className="flex justify-center py-4 relative z-10 border-b border-[#0d435a] mb-4">
        <button
          onClick={() => {
            navigate("/dashboard");
            setSidebarOpen?.(false);
          }}
          className="cursor-pointer focus:outline-none"
        >
          <img
            // src="http://192.168.101.186:8050/files/Logo_cs.png"
            // src="http://182.71.135.110:8051/files/Logo_cs.png"
            src="http://192.168.101.129:8050/files/Logo_cs.png"
            alt="CS Logistics"
            className="w-[110px] h-auto object-contain"
          />
        </button>
      </div>


      {/* Menu */}
      <nav className="flex-1 px-3 relative z-10">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              location.pathname === item.path;

            return (
              <li key={item.label}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full
                    h-10
                    flex
                    items-center
                    gap-3
                    px-3
                    rounded-lg
                    transition-all
                    text-left

                    ${
                      isActive
                        ? `
                          bg-[#0d5b7a]
                          shadow-sm
                        `
                        : `
                          hover:bg-white/5
                        `
                    }
                  `}
                >
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span className="text-[13px] font-medium">
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="
            w-full
            h-10
            flex
            items-center
            gap-3
            px-3
            rounded-lg
            hover:bg-white/5
          "
        >
          <LogOut size={17} />

          <span className="text-[13px] font-medium">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}