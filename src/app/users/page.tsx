"use client";

import useMainStore from "@/store/main";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const { session } = useMainStore();

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, []);

  return <div>USERS PAGE</div>;
};

export default Page;
