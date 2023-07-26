import React, { HTMLProps } from "react";
import { twMerge } from "tailwind-merge";

export type TextInputProps = {
  prefixComponent?: any;
  suffixComponent?: any;
  containerClassName?: string;
  label?: string;
  labelClassname?: string;
  errorMessage?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
} & HTMLProps<HTMLInputElement>;

const TextInput: React.FC<TextInputProps> = ({
  prefixComponent,
  suffixComponent,
  containerClassName,
  className,
  label,
  labelClassname,
  errorMessage,
  inputRef,
  ...rest
}) => {
  return (
    <div className={twMerge("text-left", containerClassName)}>
      <label
        htmlFor={rest.name}
        className={
          label
            ? twMerge("text-secondary pl-1 text-sm", labelClassname)
            : "sr-only"
        }
      >
        {label || rest.name}
      </label>
      <div className="relative">
        {prefixComponent && (
          <div className="pointer-events-none absolute z-20 flex h-full w-full items-center justify-start pl-2">
            {prefixComponent}
          </div>
        )}
        {suffixComponent && (
          <div className="pointer-events-none absolute z-20 flex h-full w-full items-center justify-end pr-2">
            {suffixComponent}
          </div>
        )}
        <input
          ref={inputRef}
          className={`relative block min-h-[44px] w-full appearance-none rounded-sm border border-gray-300 ${
            prefixComponent ? " pl-14" : "pl-3"
          } ${
            suffixComponent ? "pr-14" : "pr-3"
          } py-2 text-sm font-light text-gray-900 placeholder:text-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary ${className} ${
            rest.disabled && "bg-offwhiteBG"
          }`}
          {...rest}
        />
      </div>

      {errorMessage && (
        <span className="pl-1 text-xs leading-none text-red-500">
          {"* " + errorMessage}
        </span>
      )}
    </div>
  );
};

export default TextInput;
