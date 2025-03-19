import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Venzor - Where Events Come Alive ",
  description: "Connect. Create. Celebrate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: [dark],
        variables:{
          // colorBackground: "#25292d",
          colorBackground: "rgba(34, 38, 41, 0)",
          colorPrimary: "#86C232",
          colorSuccess: "#86C232",
          colorTextOnPrimaryBackground: "#ffff",
          colorInputBackground:"#25292d",
          colorTextSecondary: "#9CA3AF",
        },
        layout: {
          socialButtonsPlacement: "bottom",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased ` }
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
