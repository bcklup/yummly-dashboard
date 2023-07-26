import "@/app/globals.css";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-primary-300 pb-10 pt-14 sm:py-5  lg:pl-64">
        {children}
      </div>
    </>
  );
}
