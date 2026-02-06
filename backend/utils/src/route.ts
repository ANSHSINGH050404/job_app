import express, { raw } from "express";
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
import { json } from "node:stream/consumers";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

router.post("/carrer", async (req, res) => {
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

    let jsonResponse: any;

    try {
      const rawText: any = response.text
        ?.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      if (!rawText) {
        throw new Error("AI did not return valid JSON");
      }

      jsonResponse = JSON.parse(rawText);
    } catch (error: any) {
      res.status(500).json({
        message: "AI did not return valid JSON",
        rawResponse: response.text,
      });
    }
    res.json(jsonResponse);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/resume-analyzer", async (req, res) => {
  try {
    const { pdfBase64 } = req.body;

    if (!pdfBase64) {
      return res
        .status(400)
        .json({ error: "Pdf document resume is Required!" });
    }

    const prompt = `
You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following resume
and provide:
1. An ATS compatibility score (0-100)
2. Detailed suggestions to improve the resume for better ATS performance
Your entire response must be in valid JSON format. Do not include any text or markdown
formatting outside of the JSON structure.
The JSON object should have the following structure:

{
"atsScore": 85,
"scoreBreakdown": {
"formatting": {
"score": 90,
"feedback": "Brief feedback on formatting"
},
"keywords": {
"score": 80,
"feedback": "Brief feedback on keyword usage"
},
"structure": {
"score": 85,
"feedback": "Brief feedback on resume structure"
},
"readability": {
"score": 88,
"feedback": "Brief feedback on readability"
}
},
"suggestions": [
{
"category": "Category name (e.g., 'Formatting', 'Content', 'Keywords',
'Structure')",
"issue": "Description of the issue found",
"recommendation": "Specific actionable recommendation to fix it",
"priority": "high/medium/low"
}
],
"strengths": [
"List of things the resume does well for ATS"
],
"summary": "A brief 2-3 sentence summary of the overall ATS performance"
}
Focus on:
- File format and structure compatibility
- Proper use of standard section headings
- Keyword optimization
- Formatting issues (tables, columns, graphics, special characters)
- Contact information placement
- Date formatting
- Use of action verbs and quantifiable achievements
- Section organization and flow
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: pdfBase64.replace(/^data:application\/pdf;base64,/, ""),
              },
            },
          ],
        },
      ],
    });

    let jsonResponse: any;

    try {
      const rewText: any = response.text
        ?.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      if (!raw) {
        throw new Error("AI did not return valid JSON");
      }

      jsonResponse = JSON.parse(rewText);
    } catch (error: any) {
      res.status(500).json({
        message: "AI did not return valid JSON",
        rawResponse: response.text,
      });
    }
    res.json(jsonResponse);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
