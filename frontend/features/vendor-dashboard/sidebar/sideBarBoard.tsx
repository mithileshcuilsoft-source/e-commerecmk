"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Package,
} from "lucide-react";

const SideBarDashboard = ({ onNavItemClick }: { onNavItemClick?: () => void }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/vendors/vendor-dashboard" },
    { name: "My Products", icon: BookOpen, href: "/vendors/vendor-dashboard" },
    { name: "Orders", icon: Package, href: "/vendors/orders" },
    { name: "Analytics", icon: BarChart3, href: "#" },
    { name: "Settings", icon: Settings, href: "#" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth/login";
  };

  return (
    <div className="flex flex-col h-full py-4 sm:py-6">

  {/* LOGO */}
  <div className="px-4 sm:px-6 mb-6 sm:mb-10">
    <div className="flex items-center gap-2 text-purple-600">

      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-lg shrink-0" />

      <span className="font-black text-lg sm:text-xl text-slate-900 uppercase truncate">
        Dashboard
      </span>

    </div>
  </div>

  {/* MENU */}
  <nav className="flex-1 px-2 sm:px-4 space-y-1 overflow-y-auto">
    {menuItems.map((item) => {
      const isActive = pathname === item.href;

      return (
        <Link
          key={item.name}
          href={item.href}
          onClick={onNavItemClick}
          className={`flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
            isActive
              ? "bg-purple-50 text-purple-600"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <item.icon className="w-5 h-5 shrink-0" />

          <span className="truncate">
            {item.name}
          </span>
        </Link>
      );
    })}
  </nav>

  {/* LOGOUT */}
  <div className="px-2 sm:px-4 mt-4 sm:mt-auto">
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-200"
    >
      <LogOut className="w-5 h-5 shrink-0" />

      <span className="truncate">
        Logout
      </span>
    </button>
  </div>

</div>
  );
};

export default SideBarDashboard;