"use client";

import SQRLogo from "assets/images/sqr-logo.svg";
import Image from "next/image";
import Link from "next/link";
import { FaChevronRight, FaUsers } from "react-icons/fa";
import { BsCardChecklist } from "react-icons/bs";

import { useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut, FiMessageCircle } from "react-icons/fi";
import { supabase } from "@/app/initSupabase";
import useMainStore from "@/store/main";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { clearSession } = useMainStore();

  const isCurrentRoute = useCallback(
    (route: string) => {
      let isRoot = route === "/recipes" && pathname === "/";
      const urlPattern = new RegExp(`^\\${route}\\b`);

      return isRoot ? isRoot : urlPattern.test(pathname);
    },
    [pathname]
  );

  const handleLogout = useCallback(() => {
    supabase.auth.signOut().then(() => {
      clearSession();
      router.replace("/login");
    });
  }, [clearSession, router]);

  return (
    <aside
      id="default-sidebar"
      className="fixed left-0 top-0 z-[40] h-screen w-64 -translate-x-full transition-transform md:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col justify-between overflow-y-auto border-r bg-white px-3 pb-10 pt-4">
        <div>
          <Link
            href="/recipes"
            className="mb-8 flex flex-col items-center gap-3"
          >
            <Image src="/logo-text.png" width={140} height={80} alt="sqrLogo" />
            <p className="m-0 font-semibold text-gray-900">Admin Dashboard</p>
          </Link>

          <ul className="space-y-2">
            <li key="recipes" className="group">
              <Link
                href="/recipes"
                className={twMerge(
                  "flex items-center rounded-lg p-2 text-base font-normal text-neutral-500 group-hover:bg-neutral-200 group-hover:text-white",
                  isCurrentRoute("/recipes") && "bg-primary-300 text-white"
                )}
              >
                <BsCardChecklist
                  className={twMerge(
                    `h-5 w-5 text-neutral-500`,
                    isCurrentRoute("/recipes") && "text-white"
                  )}
                />

                <span
                  className={twMerge(
                    "ml-3 flex-1 whitespace-nowrap text-sm font-medium text-neutral-500",
                    isCurrentRoute("/recipes") && "text-white"
                  )}
                >
                  Recipes
                </span>
                <FaChevronRight
                  className={twMerge(
                    "text-neutral-500",
                    isCurrentRoute("/recipes") && "text-white"
                  )}
                />
              </Link>
            </li>

            <li key="comments" className="group">
              <Link
                href="/comments"
                className={twMerge(
                  "flex items-center rounded-lg p-2 text-base font-normal text-neutral-500 group-hover:bg-neutral-200 group-hover:text-white",
                  isCurrentRoute("/comments") && "bg-primary-300 text-white"
                )}
              >
                <FiMessageCircle
                  className={twMerge(
                    `h-5 w-5 text-neutral-500`,
                    isCurrentRoute("/comments") && "text-white"
                  )}
                />

                <span
                  className={twMerge(
                    "ml-3 flex-1 whitespace-nowrap text-sm  font-medium text-neutral-500",
                    isCurrentRoute("/comments") && "text-white"
                  )}
                >
                  Comments
                </span>

                <FaChevronRight
                  className={twMerge(
                    "text-neutral-500",
                    isCurrentRoute("/comments") && "text-white"
                  )}
                />
              </Link>
            </li>
            {/* Disable until workable
          <li key="users" className="group">
            <Link
              href="/users"
              className={twMerge(
                "flex items-center rounded-lg p-2 text-base font-normal text-neutral-500 group-hover:bg-neutral-200 group-hover:text-white",
                isCurrentRoute("/users") && "bg-primary-300 text-white"
              )}
            >
              <FaUsers
                className={twMerge(
                  `h-5 w-5 text-neutral-500`,
                  isCurrentRoute("/users") && "text-white"
                )}
              />

              <span
                className={twMerge(
                  "ml-3 flex-1 whitespace-nowrap text-sm  font-medium text-neutral-500",
                  isCurrentRoute("/users") && "text-white"
                )}
              >
                Users
              </span>
              <FaChevronRight
                className={twMerge(
                  "text-neutral-500",
                  isCurrentRoute("/users") && "text-white"
                )}
              />
            </Link>
          </li> */}
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center rounded-lg p-2 text-base font-normal text-white ring-2 ring-primary hover:bg-primary-100 hover:text-white"
        >
          <FiLogOut className="h-5 w-5 text-primary" />

          <span className="ml-3 flex-1 whitespace-nowrap text-sm  font-medium text-primary">
            Log Out
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
