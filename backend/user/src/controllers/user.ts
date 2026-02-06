import axios from "axios";
import { AuthenticatedRequest } from "../middleware/auth";
import { sql } from "../utils/db";
import { TryCatch } from "../utils/try_catch";
import getBuffer from "../utils/buffer";

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  res.json(user);
});

export const getUserProfile = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const params = req.params;
    const users = await sql`
      SELECT u.user_id, u.name, u.email, u.phone_number, u.role, u.bio, 
             u.resume, u.resume_public_id, u.profile_picture, 
             u.profile_picture_public_id, u.subscription,
             ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) AS skills
      FROM users u
      LEFT JOIN user_skills us ON u.user_id = us.user_id
      LEFT JOIN skills s ON us.skill_id = s.skill_id
      WHERE u.user_id = ${params.userId}
      GROUP BY u.user_id;
    `;

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    return res.status(200).json(user);
  },
);

export const updateUserProfile = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, phone_number, bio } = req.body;
    const newName = name || user.name;
    const newPhoneNumber = phone_number || user.phone_number;
    const newBio = bio || user.bio;

    const [updatedUser] = await sql`
      UPDATE users
      SET name = ${newName}, phone_number = ${newPhoneNumber}, bio = ${newBio}
      WHERE user_id = ${user.user_id}
      RETURNING user_id, name, email, phone_number, bio;
    `;

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User profile updated successfully", updatedUser });
  },
);

export const updateUserProfilePicture = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const oldPublicId = user.profile_picture_public_id;
    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      return res.status(400).json({ message: "Invalid file" });
    }

    try {
      const uploadUrl = `${process.env.UPLOAD_SERVICE}/upload`;
      console.log("Uploading to:", uploadUrl);
      console.log("Buffer content type:", typeof fileBuffer.content);
      console.log("Buffer content length:", fileBuffer.content?.length);

      const { data: uploadResult } = await axios
        .post(uploadUrl, {
          buffer: fileBuffer.content,
          public_id: oldPublicId,
        })
        .catch((error: any) => {
          console.error("Error uploading file - Full error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            url: uploadUrl,
          });
          throw new Error(
            error.response?.data?.error ||
              error.message ||
              "File upload failed",
          );
        });

      const [updatedUser] = await sql`
        UPDATE users
        SET profile_picture = ${uploadResult.url}, 
            profile_picture_public_id = ${uploadResult.public_id}
        WHERE user_id = ${user.user_id}
        RETURNING user_id, name, email, phone_number, bio, profile_picture, profile_picture_public_id;
      `;

      res.json({
        message: "Profile picture updated successfully",
        updatedUser,
      });
    } catch (error: any) {
      console.error("Error updating profile picture:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to update profile picture" });
    }
  },
);

export const updateResume = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No pdf file uploaded" });
  }

  const oldPublicId = user.resume_public_id;
  const fileBuffer = getBuffer(file);

  if (!fileBuffer || !fileBuffer.content) {
    return res.status(400).json({ message: "Invalid file" });
  }

  try {
    const uploadUrl = `${process.env.UPLOAD_SERVICE}/upload`;
    console.log("Uploading to:", uploadUrl);
    console.log("Buffer content type:", typeof fileBuffer.content);
    console.log("Buffer content length:", fileBuffer.content?.length);

    const { data: uploadResult } = await axios
      .post(uploadUrl, {
        buffer: fileBuffer.content,
        public_id: oldPublicId,
      })
      .catch((error: any) => {
        console.error("Error uploading file - Full error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: uploadUrl,
        });
        throw new Error(
          error.response?.data?.error || error.message || "File upload failed",
        );
      });

    const [updatedUser] = await sql`
        UPDATE users
        SET resume = ${uploadResult.url}, 
            resume_public_id = ${uploadResult.public_id}
        WHERE user_id = ${user.user_id}
        RETURNING user_id, name, resume, resume_public_id;
      `;

    res.json({
      message: "Resume updated successfully",
      updatedUser,
    });
  } catch (error: any) {
    console.error("Error updating resume:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to update resume" });
  }
});



export const addSkillToUser = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.user_id;
    const { skillName } = req.body;

    if (!skillName || skillName.trim() === "") {
      return res.status(400).json({ message: "Skill name is required" });
    }


    let wasSkillAdded = false;

    try {
      await sql`BEGIN`;

      const users = await sql`
        SELECT user_id FROM users WHERE user_id = ${userId}
      `;
      if (users.length === 0) {
        throw new Error("User not found");
      }

      const [skill] =
        await sql`INSERT INTO skills (name) VALUES (${skillName.trim()})  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING skill_id`;

      const skillId = skill.skill_id;

      const insertionResult = await sql`
        INSERT INTO user_skills (user_id, skill_id) VALUES (${userId}, ${skillId})
        ON CONFLICT (user_id, skill_id) DO NOTHING
        RETURNING user_id, skill_id
      `;

      if (insertionResult.length > 0) {
        wasSkillAdded = true;
      }

      await sql`COMMIT`;

      res.json({
        message: `Skill ${skillName} added to user successfully`,
        wasSkillAdded,
      });
    } catch (error: any) {
      await sql`ROLLBACK`;
      console.error("Error adding skill to user:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to add skill to user" });
    }
  },
);




export const deleteSkillFromUser = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.user_id;
    const { skillName } = req.body;

    if (!skillName || skillName.trim() === "") {
      return res.status(400).json({ message: "Skill name is required" });
    }

    try {
      const skill = await sql`
        SELECT skill_id FROM skills WHERE name = ${skillName.trim()}
      `;

      if (skill.length === 0) {
        throw new Error("Skill not found");
      }

      const skillId = skill[0].skill_id;

      await sql`
        DELETE FROM user_skills
        WHERE user_id = ${userId} AND skill_id = ${skillId}
      `;

      res.json({
        message: `Skill ${skillName} deleted from user successfully`,
      });
    } catch (error: any) {
      console.error("Error deleting skill from user:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to delete skill from user" });
    };
  },
);
