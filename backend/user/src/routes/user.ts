import express from "express";
import { isAuth } from "../middleware/auth";
import { getUserProfile, myProfile, updateUserProfile } from "../controllers/user";

const router = express.Router();


router.get("/me", isAuth, myProfile);
router.get("/:userId",isAuth, getUserProfile);
router.put("/update/profile", isAuth, updateUserProfile);



export default router;