import express from "express";
import { forgotPassword, loginUser, registerUser, resetPassword } from "../controllers/auth";
import uploadFile from "../middleware/multer";




const router = express.Router();


router.post("/register", uploadFile, registerUser);
router.post("/login", loginUser);
router.post("/forget", forgotPassword);
router.post("/reset/:token", resetPassword);

export default router;