import { Dialog, Transition } from "@headlessui/react";
import { Fragment, PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  backgroundClassName?: string;
} & PropsWithChildren;

const Modal = ({
  isOpen,
  onClose,
  backgroundClassName,
  className,
  children,
}: ModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className={"relative z-50"}>
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div
        className={twMerge("fixed inset-0 bg-black/30", backgroundClassName)}
        aria-hidden="true"
      />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel
          className={twMerge("mx-auto max-w-sm rounded bg-white", className)}
        >
          {children}
          {/* ... */}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
