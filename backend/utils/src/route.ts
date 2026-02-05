import express from "express";
import { v2 as cloudinary } from "cloudinary";
const router = express.Router();

router.post("/upload", async (req, res) => {
  // Handle file upload
  try {
    console.log("Upload request received");
    console.log("Request body keys:", Object.keys(req.body));

    const { buffer, public_id } = req.body;

    if (!buffer) {
      console.error("No buffer provided in request");
      return res.status(400).json({ error: "No buffer provided" });
    }

    console.log("Buffer type:", typeof buffer);
    console.log("Buffer length:", buffer?.length);
    console.log("Public ID:", public_id);

    if (public_id) {
      console.log("Deleting old image:", public_id);
      await cloudinary.uploader.destroy(public_id);
    }

    console.log("Uploading to Cloudinary...");
    const cloud = await cloudinary.uploader.upload(buffer);
    console.log("Upload successful:", cloud.public_id);

    res.json({
      url: cloud.secure_url,
      public_id: cloud.public_id,
    });
  } catch (error: any) {
    console.error("Upload error:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
