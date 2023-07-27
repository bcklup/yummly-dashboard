import Resizer from "react-image-file-resizer";

export const DateTimeFormats = {
  DisplayDateShort: "MMMM d, yyyy",
  DisplayMonth: "MMMM yyyy",
  DisplayDateTimeShort: "dd/MM/yyyy p",
  DisplayDateTimeLong: "E, d MMM yyyy p",
  FormDate: "yyyy-MM-dd",
  FormDateTime: "yyyy-MM-dd HH:mm:ss",
};

export const resizeFileHero = (file: File) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1200,
      1200,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

export const resizeFileThumb = (file: File) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      500,
      500,
      "JPEG",
      50,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });
