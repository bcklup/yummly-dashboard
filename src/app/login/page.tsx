"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useMainStore from "@/store/main";
import { FieldValues, useForm, useFormState } from "react-hook-form";
import * as yup from "yup";
import { supabase } from "../initSupabase";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import Button, { ButtonTypes } from "@/components/Button";
import { Session } from "inspector";

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { session, setSession, setProfile } = useMainStore();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user) {
      router.replace("/users");
    }
  }, []);

  const schema = yup
    .object({
      email: yup.string().email("Invalid email").required("Email required"),
      password: yup.string().required("Password required"),
    })
    .required();

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { isValid, errors } = useFormState({ control });

  const hanldeSignIn = useCallback(
    async (data: any) => {
      setIsLoading(true);
      if (!data || !isValid) return;

      const { error, data: resData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (resData.session) {
        setSession(resData.session);

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select()
          .eq("user_id", resData.session.user.id);

        setProfile(!error && profileData ? profileData[0] : null);
        router.push("/users");
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    },
    [isValid]
  );

  return (
    <div>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center space-y-6 p-8 pb-6">
          <Image src="/logo-text.png" alt="SQR Logo" width={200} height={80} />
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
            <FormInput
              control={control}
              name="login"
              type="text"
              placeholder="Email address"
            />

            <FormInput
              control={control}
              name="password"
              type="password"
              placeholder="Password"
              className="mt-3"
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
