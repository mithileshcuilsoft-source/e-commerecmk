"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import SideBarDashboard from "@/features/vendor-dashboard/sidebar/sideBarBoard";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-white border-r z-40 shadow-sm">
        <SideBarDashboard />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b fixed top-0 w-full z-50">
        <div className="flex items-center gap-2 text-purple-600">
           <div className="w-8 h-8 bg-purple-600 rounded-lg shadow-lg shadow-purple-200" />
           <span className="font-black text-lg text-slate-900">VENDOR</span>
        </div>
        <button 
          onClick={() => setOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div 
          className={`absolute left-0 top-0 w-72 bg-white h-full shadow-2xl transition-transform duration-300 ease-out transform ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close button inside mobile menu */}
          <div className="flex justify-end p-4">
            <button onClick={() => setOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
              <Menu className="w-6 h-6 rotate-90" />
            </button>
          </div>
          <SideBarDashboard onNavItemClick={() => setOpen(false)} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-64 pt-14 lg:pt-0">
        {children}
      </div>
    </div>
  );
}