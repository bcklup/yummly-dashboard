"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import { Dialog } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { GrClose } from "react-icons/gr";
import Button, { ButtonTypes } from "./Button";
import { RecipeRow } from "@/types/shorthands";
import { supabase } from "@/app/initSupabase";
import { useForm } from "react-hook-form";
import TextInput from "./TextInput";

type Props = {
  showModal: RecipeRow | string | null;
  onClose: () => void;
};

type FormValues = {
  title: string;
  description: string;
  video: string;
  ingredients: any[];
  instructions: any[];
};

const RecipeModal = ({ showModal, onClose }: Props) => {
  const isNewRecipe = useMemo(() => showModal === "new", [showModal]);

  const coreRecipe: RecipeRow | undefined = useMemo(
    () =>
      showModal !== null && showModal !== "new"
        ? (showModal as RecipeRow)
        : undefined,
    [showModal]
  );

  const schema = yup
    .object({
      title: yup.string().required(),
      description: yup.string().required(),
      video: yup.string().required(),
      ingredients: yup.array().required(),
      instructions: yup.array().required(),
    })
    .required();

  const {
    register,
    watch,
    setValue,
    reset,
    formState: { isValid, isDirty, errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const isSubmitDisabled = useMemo(() => {
    if (!isValid || (!isNewRecipe && !isDirty)) return true;
  }, [isValid, isNewRecipe, isDirty]);

  const handleClose = useCallback(() => {
    onClose();
  }, []);

  useEffect(() => {
    reset({
      title: coreRecipe?.title ? coreRecipe.title : "",
      description: coreRecipe?.description ? coreRecipe.description : "",
      video: coreRecipe?.video ? coreRecipe.video : "",
      ingredients: coreRecipe?.ingredients
        ? coreRecipe.ingredients?.ingredients || []
        : [],
      instructions: coreRecipe?.instructions
        ? coreRecipe.instructions?.steps || []
        : [],
    });
  }, [coreRecipe]);

  const titleFields = register("title", { required: true });
  const descriptionFields = register("description", { required: true });
  const videoFields = register("video", { required: true });

  return (
    <Modal
      isOpen={showModal !== null}
      onClose={handleClose}
      className="w-full max-w-4xl rounded-xl"
    >
      <div className="flex flex-1 rounded-t-xl border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex flex-1 flex-col items-center gap-3 ">
          <div className="flex w-full flex-row items-center justify-between">
            <Dialog.Title
              className="text-lg font-bold text-neutral-900"
              as="h5"
            >
              {isNewRecipe ? "Add Recipe" : "Edit Recipe"}
            </Dialog.Title>

            <button
              type="button"
              className=" bg-transparent p-3"
              onClick={handleClose}
            >
              <GrClose className="text-neutral-900" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={
          "flex w-full flex-col gap-4 divide-y divide-dashed divide-neutral-300 bg-white px-6 py-3"
        }
      >
        <div className=" flex w-full flex-col gap-1">
          <div className="flex w-full flex-row divide-x-2">
            <div className="flex flex-1 p-2">
              <TextInput
                name={titleFields.name}
                onChange={titleFields.onChange}
                onBlur={titleFields.onBlur}
                inputRef={titleFields.ref}
                type="text"
                containerClassName="w-full"
                labelClassname="font-semibold"
                className="mt-1 rounded-xl"
                placeholder="Enter Recipe Title"
                label="Recipe Title"
              />
            </div>
            <div className="flex flex-1 p-2"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-3 rounded-b-xl border-t border-neutral-200 bg-white px-6 py-4">
        <div className=" flex flex-1 items-center justify-end gap-3">
          <Button
            title="Cancel"
            buttonType={ButtonTypes.GHOST}
            onClick={handleClose}
            buttonSize="small"
            titleClassName="text-primary-500"
            className="border-primary-500"
          />
          <Button
            title={isNewRecipe ? "Submit" : "Save"}
            disabled={isSubmitDisabled}
            buttonType={ButtonTypes.PRIMARY}
            buttonSize="small"
          />
        </div>
      </div>
    </Modal>
  );
};

export default RecipeModal;
