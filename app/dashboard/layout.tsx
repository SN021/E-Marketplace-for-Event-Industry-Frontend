import React from "react";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <Navbar />
      <div className="pt-24">{children}</div>
      <Footer/>
    </div>
  );
}
