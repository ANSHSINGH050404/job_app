import express from "express";
import { registerUser } from "../controllers/auth";
import uploadFile from "../middleware/multer";




const router = express.Router();


router.post("/register", uploadFile, registerUser);

export default router;