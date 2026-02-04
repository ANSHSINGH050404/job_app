import express from "express";
import { forgotPassword, loginUser, registerUser } from "../controllers/auth";
import uploadFile from "../middleware/multer";




const router = express.Router();


router.post("/register", uploadFile, registerUser);
router.post("/login", loginUser);
router.post("/forgot", forgotPassword);
router.post("/forget", forgotPassword);

export default router;