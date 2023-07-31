import "@/app/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-primary-300 pb-10 pt-14 sm:py-5">
      <div className="w-11/12 rounded-2xl bg-white shadow-xl sm:w-[440px]">
        {children}
      </div>
    </div>
  );
}
