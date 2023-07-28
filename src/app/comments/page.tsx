"use client";

import Table from "@/components/Table";
import useMainStore from "@/store/main";
import { CommentWithProfile } from "@/types/shorthands";
import { DateTimeFormats } from "@/utils/parsers";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { supabase } from "../initSupabase";
import { toastSuccess } from "@/utils/toast";

const Page = () => {
  const router = useRouter();
  const { session } = useMainStore();
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const columnHelper = createColumnHelper<CommentWithProfile>();

  useEffect(() => {
    fetchRecipes();
    if (!session) {
      router.replace("/login");
    }
  }, []);

  const fetchRecipes = async () => {
    setIsLoading(true);
    supabase
      .from("comments")
      .select("*, profiles(*)")
      .eq("is_approved", false)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error || data.length <= 0) {
          setComments([]);
        } else {
          setComments(data as any);
        }
        setIsLoading(false);
      });
  };

  const handleDelete = useCallback(
    (item: CommentWithProfile) => async () => {
      if (confirm("Are you sure you want to delete this comment?") == true) {
        setIsLoading(true);

        await supabase.from("comments").delete().eq("id", item.id);
        await fetchRecipes();

        toastSuccess("Success!");
        setIsLoading(false);
      }
    },
    []
  );

  const handleApprove = useCallback(
    (item: CommentWithProfile) => async () => {
      setIsLoading(true);
      await supabase
        .from("comments")
        .update({ is_approved: true })
        .eq("id", item.id);
      await fetchRecipes();

      toastSuccess("Success!");
    },
    []
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor(
        (row) => `${row.profiles?.first_name} ${row.profiles?.last_name}`,
        { header: "User Full Name", id: "full_name" }
      ),

      columnHelper.accessor("comment", {
        header: "Comment",
      }),

      columnHelper.accessor(
        (row) =>
          format(
            new Date(row.created_at || ""),
            DateTimeFormats.DisplayDateTimeShort
          ),
        { header: "Date Created", id: "created_at" }
      ),

      columnHelper.display({
        id: "actions",

        cell: (props) => {
          const originalData = props.row.original;

          return (
            <div className="flex flex-row gap-2">
              <button
                type="button"
                className="w-full justify-center border-none p-0"
                onClick={handleApprove(originalData)}
                disabled={isLoading}
              >
                <AiFillCheckCircle className="h-5 w-5 text-green-400" />
              </button>

              <button
                type="button"
                className="w-full justify-center border-none p-0"
                onClick={handleDelete(originalData)}
                disabled={isLoading}
              >
                <AiFillCloseCircle className="h-5 w-5 text-red-400" />
              </button>
            </div>
          );
        },
      }),
    ],
    [columnHelper, handleApprove, handleDelete, isLoading]
  );
  return (
    <div className="flex h-4/5 w-full flex-col rounded-lg bg-white p-4">
      <h1 className="text-xl font-bold">Comment Moderation</h1>
      <p className="mb-4 text-neutral-400">
        Approve and Delete user-made comments.
      </p>
      <Table<CommentWithProfile> columnDef={columns} data={comments} />
    </div>
  );
};

export default Page;
