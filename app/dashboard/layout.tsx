import React from "react";
import Navbar from "./_components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <Navbar />
      <div>{children}</div>
    </div>
  );
}
