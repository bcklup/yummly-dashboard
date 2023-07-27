import { ToastOptions, toast } from "react-toastify";

export const toastError = (message?: string, options?: ToastOptions) => {
  const toastMsg = message || "Error occured. Please try again later.";
  toast.error(toastMsg, {
    theme: "colored",
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...options,
  });
};

export const toastSuccess = (message?: string, options?: ToastOptions) => {
  const toastMsg = message || "Success!";
  toast.success(toastMsg, {
    theme: "colored",
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...options,
  });
};
