import ErrorHandler from "../utils/error_handler";
import { TryCatch } from "../utils/try_catch";
import { sql } from "../utils/db.js";
import bcrypt from "bcryptjs";
import getBuffer from "../utils/buffer";
import axios from "axios";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { forgotPasswordTemplate } from "../template";
import { publishToTopic } from "../producer";

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password must be less than 255 characters"),
  phone_number: z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number must be less than 15 characters"),
  role: z.enum(["jobseeker", "recruiter"]),
  bio: z.string().max(1000, "Bio must be less than 1000 characters").optional()
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerUser = TryCatch(async (req, res) => {
  const validationResult = registerSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map(err => `${err.path.join(".")}: ${err.message}`).join(", ");
    throw new ErrorHandler(400, `Validation failed: ${errorMessages}`);
  }

  const { email, name, password, phone_number, role, bio } = validationResult.data;

  const existingUser =
    await sql`SELECT user_id FROM users WHERE email = ${email}`;

  if (existingUser.length > 0) {
    throw new ErrorHandler(409, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let registerdUser;

  if (role === "recruiter") {
    const [user] =
      await sql`INSERT INTO users (name, email, password, phone_number, role) VALUES
            (${name}, ${email}, ${hashedPassword}, ${phone_number}, ${role}) RETURNING 
            user_id, name, email, phone_number, role, created_at`;

    registerdUser = user;
  } else if (role === "jobseeker") {
    const file = req.file;

    if (!file) {
      throw new ErrorHandler(400, "Resume file is required for jobseeker");
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      throw new ErrorHandler(500, "Error processing resume file");
    }

    const { data } = await axios.post(
      `${process.env.UPLOAD_SERVICE}/api/utils/upload`,
      {
        buffer: fileBuffer.content,
      },
    );

    const [user] =
      await sql`INSERT INTO users (name, email, password, phone_number, role, bio, resume, resume_public_id ) VALUES
        (${name}, ${email}, ${hashedPassword}, ${phone_number}, ${role}, ${bio} ,${data.url}, ${data.public_id}) RETURNING 
        user_id, name, email, phone_number, role,bio, resume, created_at`;

    registerdUser = user;
  } else {
    throw new ErrorHandler(400, "Invalid role");
  }

  const token = jwt.sign(
    {
      id: registerdUser?.user_id,
    },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "7d",
    },
  );

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: registerdUser,
    token,
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const validationResult = loginSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map(err => `${err.path.join(".")}: ${err.message}`).join(", ");
    throw new ErrorHandler(400, `Validation failed: ${errorMessages}`);
  }

  const { email, password } = validationResult.data;

  const user = await sql`
    SELECT u.user_id, u.name, u.email, u.password, u.phone_number, u.role, u.bio, u.resume, u.profile_picture, u.subscription,ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) AS skills
    FROM users u
    LEFT JOIN user_skills us ON u.user_id = us.user_id
    LEFT JOIN skills s ON us.skill_id = s.skill_id
    WHERE u.email = ${email}
    GROUP BY u.user_id
    `;

  if (user.length === 0) {
    throw new ErrorHandler(401, "Invalid email or password");
  }

  const userObject = user[0];
  console.log(userObject);

  const matchPassword = await bcrypt.compare(password, userObject.password);

  if (!matchPassword) {
    throw new ErrorHandler(401, "Invalid email or password");
  }

  userObject.skills = userObject.skills || [];

  delete userObject.password;

  const token = jwt.sign(
    {
      id: userObject?.user_id,
    },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "7d",
    },
  );

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: userObject,
    token,
  });
});


export const forgotPassword = TryCatch(async (req, res, next) => {
  // Implementation for forgot password

   const {email} = req.body;

   if (!email) {
     throw new ErrorHandler(400, "Email is required");
   }

   const users = await sql`SELECT user_id, email FROM users WHERE email = ${email}`;

   if (users.length === 0) {
     

    return res.json({
      message:"If that email address is in our database, we will send you an email to reset your password.",
    });


   }

   // Here you would typically generate a password reset token,
    
   const user = users[0];

   const resetToken = jwt.sign(
    {
      id: user.user_id,
    },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "10m",
    },
  );


  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;


  const message: any = {
    to: email,
    subject: "Password Reset Request",
    html: forgotPasswordTemplate(resetLink),
  };


  publishToTopic("send-email", message);


    res.json({
      message:"If that email address is in our database, we will send you an email to reset your password.",
    });
});