"use client";

import moment from "moment";
import useMainStore from "@/store/main";
import { Database } from "@/types/supabase";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../initSupabase";
import Table from "@/components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { RecipeRow } from "@/types/shorthands";
import Button, { ButtonTypes } from "@/components/Button";
import { DateTimeFormats } from "@/utils/parsers";
import { RiFileSearchFill } from "react-icons/ri";

const Page = () => {
  const router = useRouter();
  const { session } = useMainStore();
  const [recipes, setRecipes] = useState<
    Database["public"]["Tables"]["recipes"]["Row"][]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recipeModal, setRecipeModal] = useState<string | null>(null);

  const columnHelper = createColumnHelper<RecipeRow>();

  useEffect(() => {
    fetchRecipes();
    if (!session) {
      router.replace("/login");
    }
  }, []);

  const fetchRecipes = async () => {
    setIsLoading(true);
    supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error || data.length <= 0) {
          setRecipes([]);
        } else {
          setRecipes(data);
        }
        setIsLoading(false);
      });
  };

  const handleOpenModal = useCallback((id: string) => {
    setRecipeModal(id);
  }, []);

  const handleCloseModal = useCallback(() => {
    setRecipeModal(null);
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Title",
      }),

      columnHelper.accessor("id", {
        header: "Recipe Id",
      }),
      columnHelper.accessor(
        (row) =>
          moment(row.created_at).format(DateTimeFormats.DisplayDateTimeShort),
        { header: "Date Created", id: "created_at" }
      ),

      columnHelper.display({
        id: "actions",

        cell: (props) => {
          const originalData = props.row.original;

          return (
            <Button
              title=""
              type="button"
              buttonType={ButtonTypes.GHOST}
              buttonSize="xs"
              className="w-full justify-center border-none p-0"
              onClick={() => handleOpenModal(originalData.id)}
              prefixComponent={
                <RiFileSearchFill className="h-5 w-5 text-neutral-400" />
              }
            />
          );
        },
      }),
    ],
    [columnHelper, handleOpenModal]
  );

  return (
    <div className="flex h-4/5 w-full flex-col rounded-lg bg-white p-4">
      <h1 className="text-xl font-bold">Recipes Management</h1>
      <div className="mb-2 mt-6 flex w-full flex-row justify-end">
        <Button
          buttonType={ButtonTypes.PRIMARY}
          type="button"
          buttonSize="small"
          title="Add Recipe"
          disabled={isLoading}
        />
      </div>
      <Table columnDef={columns} data={recipes} />
    </div>
  );
};

export default Page;
