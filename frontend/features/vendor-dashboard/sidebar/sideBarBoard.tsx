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

const SideBarDashboard = () => {
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
    <div className="flex flex-col h-full py-6 ">
      <div className="px-6 mb-10">
        <div className="flex items-center gap-2 text-purple-600">
          <div className="w-8 h-8 bg-purple-600 rounded-lg" />
          <span className="font-black text-xl text-slate-900 uppercase">
            Dashboard
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                isActive
                  ? "bg-purple-50 text-purple-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideBarDashboard;