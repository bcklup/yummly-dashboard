import React, { HTMLProps, memo, useMemo } from "react";
import { twMerge } from "tailwind-merge";

type Size = "xs" | "small" | "medium" | "large";

type Props = {
  title: string;
  buttonType?: ButtonTypes;
  buttonSize?: Size;
  prefixComponent?: React.ReactNode;
  suffixComponent?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  type?: "submit" | "button" | "reset";
} & HTMLProps<HTMLButtonElement>;

export enum ButtonTypes {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  GHOST = "ghost",
  LINK = "link",
  SUCCESS = "success",
  DESTRUCTIVE = "destructive",
}

const ButtonContainerStyleMaps = {
  [ButtonTypes.PRIMARY]:
    "bg-primary-400 disabled:bg-neutral-50 disabled:border-neutral-100 border-primary-400 border hover:bg-primary-700",
  [ButtonTypes.SECONDARY]:
    "bg-transparent border-2 border-primary-400 hover:border-primary",
  [ButtonTypes.GHOST]:
    "bg-transparent disabled:bg-neutral-100 border border-neutral-100 ",
  [ButtonTypes.LINK]: "bg-transparent",
  [ButtonTypes.SUCCESS]: "bg-success-600 hover:bg-success",
  [ButtonTypes.DESTRUCTIVE]: "bg-red-500 hover:bg-red-300",
};

const ButtonContainerSizeMaps = {
  xs: "rounded-[4px] py-[6px] px-[12px]",
  small: "rounded-[6px] py-[8px] px-[15px]",
  medium: "rounded-[8px] py-[12px] px-[18px]",
  large: "rounded-[8px] py-[18px] px-[24px]",
};

const TitleStyleMaps = {
  [ButtonTypes.PRIMARY]:
    "text-white group-hover:text-primary-200 group-disabled:text-neutral-300",
  [ButtonTypes.SECONDARY]:
    "text-primary-400 group-hover:text-primary group-disabled:text-neutral-300",
  [ButtonTypes.GHOST]:
    "text-neutral-700 group-hover:text-neutral group-clicked:text-neutral-300 group-disabled:text-neutral-300",
  [ButtonTypes.LINK]: "text-primary-400 group-hover:text-primary-200",
  [ButtonTypes.SUCCESS]: "text-white",
  [ButtonTypes.DESTRUCTIVE]: "text-white",
};

const TitleSizeMaps = {
  xs: "text-xs",
  small: "text-sm",
  medium: "text",
  large: "text-lg",
};

const Button: React.FC<Props> = ({
  buttonType = ButtonTypes.PRIMARY,
  buttonSize = "medium",
  prefixComponent,
  suffixComponent,
  title,
  className,
  titleClassName,
  ...props
}) => {
  const buttonClassNames = useMemo(() => {
    return twMerge(
      "group flex flex-row gap-1 items-center justify-center",
      ButtonContainerStyleMaps[buttonType],
      ButtonContainerSizeMaps[buttonSize],
      className
    );
  }, [buttonType, buttonSize, className]);

  const textClassNames = useMemo(
    () =>
      twMerge(
        "font-semibold",
        TitleStyleMaps[buttonType],
        TitleSizeMaps[buttonSize],
        titleClassName
      ),
    [buttonType, buttonSize, titleClassName]
  );

  return (
    <button className={buttonClassNames} {...props}>
      {prefixComponent}
      <h3 className={textClassNames}>{title}</h3>
      {suffixComponent}
    </button>
  );
};

export default memo(Button);
