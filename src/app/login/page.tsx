"use client";

import Button, { ButtonTypes } from "@/components/Button";
import TextInput from "@/components/TextInput";
import useMainStore from "@/store/main";
import { toastError } from "@/utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { supabase } from "../initSupabase";

type FormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { session, setSession, clearSession, setProfile } = useMainStore();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user) {
      router.replace("/recipes");
    }
  }, [router, session]);

  const schema = yup
    .object({
      email: yup.string().email("Invalid email").required("Email required"),
      password: yup.string().required("Password required"),
    })
    .required();

  const {
    handleSubmit,
    register,
    reset,
    formState: { isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const hanldeSignIn = useCallback(
    async (data: any) => {
      setIsLoading(true);
      console.log("[Log] data, isValid", { data, isValid });
      if (!data || !isValid) return;

      const { error, data: resData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (resData.session) {
        const { data: data2, error: error2 } = await supabase
          .from("profiles")
          .select()
          .eq("user_id", resData.session.user.id)
          .eq("is_admin", true)
          .maybeSingle();
        console.log("[Log] data2, error2", { data2, error2 });
        if (error2 || !data2) {
          supabase.auth.signOut().then(() => {
            clearSession();
            reset();
            toastError("You do not have authorization to access the system.");
            setIsLoading(false);
          });
        } else {
          setSession(resData.session);

          const { data: profileData, error } = await supabase
            .from("profiles")
            .select()
            .eq("user_id", resData.session.user.id);

          setProfile(!error && profileData ? profileData[0] : null);
          router.push("/recipes");
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        toastError(error?.message);
      }
    },
    [isValid]
  );

  const emailFields = register("email", { required: true });
  const passwordFields = register("password", { required: true });

  return (
    <div>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center space-y-6 p-8 pb-6">
          <Image
            src="/logo-text.png"
            alt="Yummly Logo"
            width={200}
            height={80}
          />
          <div>
            <h4 className="text-center text-lg font-bold">
              Welcome to Yummly Admin Dashboard
            </h4>
            <p className="mt-3 text-center text-sm">
              Log in with your admin credentials to continue:
            </p>
          </div>
          <form
            onSubmit={handleSubmit(hanldeSignIn)}
            className="mt-6 w-full items-stretch"
          >
            <TextInput
              name={emailFields.name}
              onChange={emailFields.onChange}
              onBlur={emailFields.onBlur}
              inputRef={emailFields.ref}
              type="email"
              className="mt-3"
              placeholder="Enter Email Address"
            />
            <TextInput
              name={passwordFields.name}
              onChange={passwordFields.onChange}
              onBlur={passwordFields.onBlur}
              inputRef={passwordFields.ref}
              type="password"
              className="mt-3"
              placeholder="Enter Password"
            />

            <Button
              buttonType={ButtonTypes.PRIMARY}
              type="submit"
              buttonSize="medium"
              title="Log In"
              disabled={isLoading}
              className="mt-6 w-full"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
