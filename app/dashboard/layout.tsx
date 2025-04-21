import React from "react";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import { CategoryBar } from "./_components/CategoryBar";



export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <Navbar />
      <CategoryBar/>
      <div className="pt-24">{children}</div>
      <Footer />
    </div>
  );
}
