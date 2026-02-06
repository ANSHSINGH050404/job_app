import express from "express";
import { isAuth } from "../middleware/auth";
import { addSkillToUser, deleteSkillFromUser, getUserProfile, myProfile, updateResume, updateUserProfile, updateUserProfilePicture } from "../controllers/user";
import uploadFile from "../middleware/multer";

const router = express.Router();


router.get("/me", isAuth, myProfile);
router.get("/:userId",isAuth, getUserProfile);
router.put("/update/profile", isAuth, updateUserProfile);
router.put("/update/pic", isAuth, uploadFile, updateUserProfilePicture);
router.put("/update/resume", isAuth, uploadFile, updateResume);
router.post("/skill/add",isAuth,addSkillToUser);
router.post("/skill/delete",isAuth,deleteSkillFromUser);


export default router;