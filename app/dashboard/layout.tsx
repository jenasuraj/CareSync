"use client";

import React from "react";
import Sidebar from "@/ui/Sidebar";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const role =
    pathname.startsWith("/dashboard/admin")
      ? "admin"
      : pathname.startsWith("/dashboard/patient")
      ? "patient"
      : "";

  return (
    <section className="w-full max-h-screen overflow-y-auto flex bg-white">
      <Sidebar role={role} />

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </section>
  );
};

export default Layout;
