import ErrorHandler from "../utils/error_handler";
import { TryCatch } from "../utils/try_catch";
import { sql } from "../utils/db.js";
import bcrypt from "bcryptjs";
import getBuffer from "../utils/buffer";
import axios from "axios";


export const registerUser = TryCatch(async (req, res) => {
  const { email, name, password, phone_number, role,bio } = req.body;

  if (!email || !name || !password || !phone_number || !role) {
    throw new ErrorHandler(400, "All fields are required");
  }

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

    const {data} = await axios.post( `${process.env.UPLOAD_SERVICE}/api/utils/upload`, {
       buffer: fileBuffer.content
    });

    const [user] =
      await sql`INSERT INTO users (name, email, password, phone_number, role, bio, resume, resume_public_id ) VALUES
        (${name}, ${email}, ${hashedPassword}, ${phone_number}, ${role}, ${bio} ,${data.url}, ${data.public_id}) RETURNING 
        user_id, name, email, phone_number, role,bio, resume, created_at`;

    registerdUser = user;
  } else {
    throw new ErrorHandler(400, "Invalid role");
  }

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: registerdUser
  });
});
