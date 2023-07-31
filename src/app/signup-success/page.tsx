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

export default function Page() {
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
              Welcome to Yummly Recipes!
            </h4>
            <p className="mt-3 text-center text-sm">
              You have successfully created an account. You may now close this
              window and login to the app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
