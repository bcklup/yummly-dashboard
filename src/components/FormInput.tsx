import TextInput, { TextInputProps } from "@/components/TextInput";
import React, { HTMLProps } from "react";
import { Control, RegisterOptions, useController } from "react-hook-form";

// wrapper component to integrate with react-hook-form
type Props = {
  name: string;
  htmlType?: "text" | "number";
  control: Control;
  rules?: RegisterOptions;
  defaultValue?: any;
  inputRef?: React.RefObject<HTMLInputElement>;
} & TextInputProps &
  HTMLProps<HTMLInputElement>;

const FormInput: React.FC<Props> = ({
  control,
  name,
  rules,
  htmlType,
  defaultValue,
  inputRef,
  ...rest
}) => {
  const { field } = useController({
    control,
    defaultValue: defaultValue || "",
    rules,
    name,
  });

  return (
    <TextInput
      inputRef={inputRef}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      {...rest}
    />
  );
};

export default FormInput;
