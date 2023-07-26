"use client";

import useMainStore from "@/store/main";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/app/initSupabase";

const Page = () => {
  const router = useRouter();
  const { setSession, setProfile, clearSession } = useMainStore();

  const startup = async () => {
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        console.log("[Log] session", { session });
        if (session) {
          setSession(session);

          const { data: profileData, error } = await supabase
            .from("profiles")
            .select()
            .eq("user_id", session.user.id);

          setProfile(!error && profileData ? profileData[0] : null);

          router.push("/users");
        } else throw new Error("Session is null");
      })
      .catch(() => {
        clearSession();
        router.replace("/login");
      });
  };

  useEffect(() => {
    startup();
  }, []);

  return <div>USERS PAGE</div>;
};

export default Page;
