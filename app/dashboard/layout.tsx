import React from "react";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import { CategoryBar } from "./_components/CategoryBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50 flex flex-col">
        <Navbar />
        <div className="pt-24">
          <CategoryBar />
        </div>
      </div>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
