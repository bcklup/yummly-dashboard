import "react-toastify/dist/ReactToastify.css";
import "react-datetime/css/react-datetime.css";
import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yummly Recipes: Admin Dashboard",
  description: "Admin Dashboard for Yummly Recipes app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />

        {children}
      </body>
    </html>
  );
}
