import multer from "multer";

export default function createMulterStorage(destination: string) {
  return multer.diskStorage({
    destination: destination,
    filename: function (req, file, cb) {
      console.log("multer file", file);

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename =
        file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1];

      cb(null, filename);
    },
  });
}
