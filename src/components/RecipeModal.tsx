"use client";

import { supabase } from "@/app/initSupabase";
import Button, { ButtonTypes } from "@/components/Button";
import Modal from "@/components/Modal";
import TextInput from "@/components/TextInput";
import { RecipeRow } from "@/types/shorthands";
import { resizeFileHero, resizeFileThumb } from "@/utils/parsers";
import { toastError, toastSuccess } from "@/utils/toast";
import { Dialog } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { cloneDeep } from "lodash";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { FiArrowDown } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import { Json } from "@/types/supabase";
import IngredientsBuilder from "./IngredientsBuilder";
import InstructionsBuilder from "./InstructionsBuilder";

type Props = {
  showModal: RecipeRow | string | null;
  onClose: () => void;
  refreshTable: () => void;
};

type FormValues = {
  title: string;
  description: string;
  video: string;
};

type FileWithPreview = {
  file: File;
  preview: string;
};

export type Ingredients = { id: number; quantity: string; item: string }[];
export type Instructions = { id: number; value: string }[];

const RecipeModal = ({ showModal, onClose, refreshTable }: Props) => {
  const [imageFile, setImageFile] = useState<FileWithPreview | undefined>();
  const [ingredients, setIngredients] = useState<Ingredients>([]);
  const [instructions, setInstructions] = useState<Instructions>([]);

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
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  console.log("[Log] isValid, erors", { isValid, errors });

  const isSubmitDisabled = useMemo(() => {
    if (!isValid) return true;
    if (
      (!isNewRecipe || imageFile) &&
      instructions.length > 0 &&
      ingredients.length > 0
    )
      return false;
    return true;
  }, [isValid, isNewRecipe, ingredients, instructions, imageFile]);

  const handleClose = useCallback(() => {
    setImageFile(undefined);
    setIngredients([]);
    setInstructions([]);
    onClose();
  }, [onClose, setIngredients, setInstructions]);

  const coreImage = useMemo(() => {
    if (coreRecipe && coreRecipe.hero_img) {
      return supabase.storage
        .from("recipe_photos")
        .getPublicUrl(`thumb/${coreRecipe.hero_img}`).data.publicUrl;
    }
    return "";
  }, [coreRecipe]);

  useEffect(() => {
    reset({
      title: coreRecipe?.title ? coreRecipe.title : "",
      description: coreRecipe?.description ? coreRecipe.description : "",
      video: coreRecipe?.video ? coreRecipe.video : "",
    });
    if (coreRecipe?.ingredients?.ingredients?.length) {
      setIngredients(
        cloneDeep(coreRecipe.ingredients.ingredients).map(
          (item: any, index: number) => ({
            ...item,
            id: index,
          })
        )
      );
    }
    if (coreRecipe?.instructions?.steps?.length) {
      setInstructions(
        cloneDeep(coreRecipe.instructions.steps).map(
          (item: any, index: number) => ({
            value: item,
            id: index,
          })
        )
      );
    }
  }, [coreRecipe]);

  useEffect(() => {
    return () => {
      if (imageFile?.preview) URL.revokeObjectURL(imageFile?.preview);
    };
  }, []);

  const titleFields = register("title", { required: true });
  const descriptionFields = register("description", { required: true });
  const videoFields = register("video", { required: true });

  const handleDelete = async () => {
    if (!isNewRecipe && coreRecipe) {
      if (confirm("Are you sure you want to delete this recipe?") == true) {
        await supabase.from("recipes").delete().eq("id", coreRecipe?.id);
        await refreshTable();

        toastSuccess("Success!");
        handleClose();
      }
    }
  };

  const handleSave = async (data: any) => {
    const imageName = `${uuidv4()}.jpeg`;
    const parsedInstructions = instructions.map((item) => item.value);
    if (isNewRecipe) {
      supabase
        .from("recipes")
        .insert({
          title: data.title,
          description: data.description,
          video: data.video,
          hero_img: imageName,
          ingredients: {
            ingredients: ingredients as any,
          },
          instructions: {
            steps: parsedInstructions as any,
          },
        })
        .then(async ({ data, error }) => {
          console.log("[Log] data,error", { data, error });
          const hero = await resizeFileHero(imageFile!.file);
          const thumb = await resizeFileThumb(imageFile!.file);
          const { error: err1, data: data1 } = await supabase.storage
            .from("recipe_photos")
            .upload(`hero/${imageName}`, hero as File);
          const { error: err2, data: data2 } = await supabase.storage
            .from("recipe_photos")
            .upload(`thumb/${imageName}`, thumb as File);
          console.log("[Log] data1, err1", { data1, err1 });
          console.log("[Log] data2, err2", { data2, err2 });
          await refreshTable();

          toastSuccess("Success!");
          handleClose();
        });
    } else {
      supabase
        .from("recipes")
        .update({
          title: data.title,
          description: data.description,
          video: data.video,
          hero_img: coreRecipe?.hero_img,
          ingredients: {
            ingredients: ingredients as any,
          },
          instructions: {
            steps: parsedInstructions as any,
          },
        })
        .eq("id", coreRecipe?.id || "")
        .then(async ({ data, error }) => {
          console.log("[Log] data,error", { data, error });
          if (imageFile && !error) {
            const hero = await resizeFileHero(imageFile!.file);
            const thumb = await resizeFileThumb(imageFile!.file);
            const { error: err1, data: data1 } = await supabase.storage
              .from("recipe_photos")
              .update(`hero/${coreRecipe?.hero_img}`, hero as File);
            const { error: err2, data: data2 } = await supabase.storage
              .from("recipe_photos")
              .update(`thumb/${coreRecipe?.hero_img}`, thumb as File);
            console.log("[Log] data1, err1", { data1, err1, hero });
            console.log("[Log] data2, err2", { data2, err2, thumb });
            await refreshTable();

            toastSuccess("Success!");
            handleClose();
          } else {
            await refreshTable();

            toastSuccess("Success!");
            handleClose();
          }
        });
    }
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    if (acceptedFiles.length) {
      setImageFile({
        file: acceptedFiles[0],
        preview: URL.createObjectURL(acceptedFiles[0]),
      });
    } else {
      toastError("Error: Invalid image format / File size too big.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/png": [".png"], "image/jpeg": [".jpeg", ".jpg"] },
    maxFiles: 1,
    maxSize: 4 * 1000 * 1000,
    minSize: 1000,
  });

  const ImagePreview = useMemo(() => {
    if (!(imageFile && imageFile.preview) && !coreImage) return <></>;
    return (
      <div className="flex justify-center self-center align-middle">
        <Image
          alt="Preview Image"
          src={
            imageFile?.preview || `${coreImage}?${new Date().getTime()}` || ""
          }
          height={100}
          width={100}
          className="h-[100%] max-h-[300px] w-auto rounded-xl bg-contain"
        />
      </div>
    );
  }, [imageFile, coreImage]);

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
        <div className=" flex w-full flex-col gap-1 divide-y">
          <div className="flex w-full flex-row divide-x">
            <div className="flex flex-1 flex-col gap-2 pb-3 pr-2">
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

              <div className="w-full text-left">
                <label
                  htmlFor={descriptionFields.name}
                  className="pl-1 text-sm font-semibold"
                >
                  Description
                </label>
                <textarea
                  placeholder="Enter Recipe Title"
                  className="relative mt-1 block min-h-[44px] w-full appearance-none rounded-xl border border-gray-300 px-3 py-2 text-sm font-light text-gray-900 placeholder:text-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary"
                  name={descriptionFields.name}
                  ref={descriptionFields.ref}
                  rows={3}
                  onChange={descriptionFields.onChange}
                  onBlur={descriptionFields.onBlur}
                />
              </div>

              <label
                htmlFor={videoFields.name}
                className="pl-1 text-sm font-semibold"
              >
                Drive Video URL
              </label>
              <div className=" mx-2 flex flex-col justify-center rounded bg-neutral-200 px-2 py-1">
                <p className="text-center text-xs">
                  https://drive.google.com/file/d/
                  <span className="bg-green-200">XXXXXXX</span>/view
                </p>
                <FiArrowDown className="self-center text-center text-primary-400" />
                <p className="text-center text-xs">
                  https://drive.google.com/uc?export=download&id=
                  <span className="bg-green-200">XXXXXXX</span>
                </p>
              </div>
              <TextInput
                name={videoFields.name}
                onChange={videoFields.onChange}
                onBlur={videoFields.onBlur}
                inputRef={videoFields.ref}
                type="url"
                placeholder="Video URL"
                containerClassName="w-full"
                labelClassname="font-semibold"
                className="mt-0 rounded-xl text-xs"
              />
            </div>

            <div className="flex flex-1 flex-col gap-2 pb-3 pl-2">
              <h6 className="pl-1 text-sm font-semibold">Hero Image</h6>
              <div
                {...getRootProps({
                  className:
                    "bg-orange-50 border-4 border-primary-100 border-dashed mx-4 rounded-xl px-8 py-2",
                })}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    Drag & drop some files here, or click to select files (max.
                    4MB)
                  </p>
                )}
                {ImagePreview}
              </div>
            </div>
          </div>
          <div className="flex w-full flex-row divide-x pt-2">
            <div className="flex flex-1 flex-col gap-2 pb-3 pr-2">
              <h6 className="pl-1 font-semibold">Ingredients</h6>
              <IngredientsBuilder
                ingredients={ingredients}
                setIngredients={setIngredients}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 pb-3 pl-2">
              <h6 className="pl-1 font-semibold">Directions</h6>
              <InstructionsBuilder
                instructions={instructions}
                setInstructions={setInstructions}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-3 rounded-b-xl border-t border-neutral-200 bg-white px-6 py-4">
        <div className=" flex flex-1 items-center justify-between">
          <Button
            title="Delete"
            buttonType={ButtonTypes.DESTRUCTIVE}
            onClick={handleDelete}
            buttonSize="small"
          />
          <div className="flex flex-row gap-3">
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
              onClick={handleSubmit(handleSave)}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RecipeModal;
