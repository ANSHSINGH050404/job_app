import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage }).single("file");

const uploadFile = (req: any, res: any, next: any) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer Error:", err);
      // A Multer error occurred when uploading.
      return res.status(400).json({
        message: `File upload error: ${err.message}. Ensure you are sending a form-data field named 'file'.`,
        error: err.code,
      });
    } else if (err) {
      console.error("Unknown Upload Error:", err);
      // An unknown error occurred when uploading.
      return res
        .status(500)
        .json({ message: "An unknown error occurred during file upload." });
    }
    // Everything went fine.
    next();
  });
};

export default uploadFile;
