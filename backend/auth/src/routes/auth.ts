import express from "express";
import { loginUser, registerUser } from "../controllers/auth";
import uploadFile from "../middleware/multer";




const router = express.Router();


router.post("/register", uploadFile, registerUser);
router.post("/login", loginUser);

export default router;