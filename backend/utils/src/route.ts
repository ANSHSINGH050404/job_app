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

import { GoogleGenAI } from "@google/genai";

import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

router.post("/career", async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills) {
      return res.status(400).json({ error: "No skills provided" });
    }

    const prompt: string = `
Based on the following skills: ${skills}.
Please act as a career advisor and generate a career path suggestion.
Your entire response must be in a valid JSON format. Do not include any text or markdown
formatting outside of the JSON structure.
The JSON object should have the following structure:
{
"summary": "A brief, encouraging summary of the user's skill set and their general job
title.",
"jobOptions": [
{
"title": "The name of the job role.",
"responsibilities": "A description of what the user would do in this role.",
"why": "An explanation of why this role is a good fit for their skills."
}
],
"skillsToLearn": [
{
"category": "A general category for skill improvement (e.g., 'Deepen Your Existing Stack
Mastery', 'DevOps & Cloud').",
"skills": [
{
"title": "The name of the skill to learn.",
"why": "Why learning this skill is important.",
"how": "Specific examples of how to learn or apply this skill."
}
]
}
],
"learningApproach": {
"title": "How to Approach Learning",
"points": ["A bullet point list of actionable advice for learning."]
}
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
  } catch (error:any) {

    res.status(500).json({ error: error.message });
  }
});

export default router;
