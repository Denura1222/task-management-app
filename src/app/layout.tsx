import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {NextUIProvider} from "@nextui-org/system";
import React from "react";
import NavBar from "@/components/NavBar";
import MenuDrawer from "@/components/MenuDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <NavBar/>
    <div className="flex overflow-hidden">
      <MenuDrawer/>
      <div className="flex-1 bg-customGreen4 overflow-auto p-10">
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </div>
    </div>
    </body>
    </html>
);
}
