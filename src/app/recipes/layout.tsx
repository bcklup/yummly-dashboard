import "@/app/globals.css";
import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col items-center justify-start bg-primary-300 pb-10 pt-14 sm:py-5 md:pl-72 md:pr-12">
        {children}
      </div>
    </>
  );
}
