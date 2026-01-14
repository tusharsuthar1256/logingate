import React from "react";
import DashboardNavrbar from "../(components)/DashboardNavrbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gray-50 dark:bg-black antialiased">
      <DashboardNavrbar />
      <main className="px-4 py-6 mt-[100px]">
        {children}
      </main>
    </section>
  );
}
