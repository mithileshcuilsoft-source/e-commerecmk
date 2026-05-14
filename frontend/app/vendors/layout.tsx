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
    <div className="bg-[#f8fafc]">
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white border-r z-40">
        <SideBarDashboard />
      </aside>

      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b fixed w-full z-50">
        <h1 className="font-bold">Dashboard</h1>
        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="bg-black/40 w-full"
            onClick={() => setOpen(false)}
          />
          <div className="w-64 bg-white h-full shadow-lg">
            <SideBarDashboard />
          </div>
        </div>
      )}


      <div className="md:ml-64 pt-16 md:pt-0 min-h-screen">
        {children}
      </div>
    </div>
  );
}