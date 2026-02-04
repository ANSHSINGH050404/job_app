import ErrorHandler from "../utils/error_handler";
import { TryCatch } from "../utils/try_catch";
import { sql } from "../utils/db.js";
import bcrypt from "bcryptjs";

export const registerUser = TryCatch(async (req, res) => {

    const {email , name, password, phone_number, role}=req.body;


    if (!email || !name || !password || !phone_number || !role) {
        throw new ErrorHandler( 400, "All fields are required");
    }

        const existingUser = await sql`SELECT user_id FROM users WHERE email = ${email}`;

        if (existingUser.length > 0) {
            throw new ErrorHandler( 409, "User already exists with this email");
        }
         
        const hashedPassword = await bcrypt.hash(password, 10);

        let registerdUser;

        if(role === 'recruiter  '){

           const [user] = await sql`INSERT INTO users (name, email, password, phone_number, role) VALUES
            (${name}, ${email}, ${hashedPassword}, ${phone_number}, ${role}) RETURNING 
            user_id, name, email, phone_number, role, created_at`;
          
            registerdUser = user;


        }else if (role === 'jobseeker'){
            
            const [user] = await sql`INSERT INTO users (name, email, password, phone_number, role) VALUES
            (${name}, ${email}, ${hashedPassword}, ${phone_number}, ${role}) RETURNING 
            user_id, name, email, phone_number, role, bio, resume, profile_picture, created_at`;
          
            registerdUser = user;
        }
        else {
            throw new ErrorHandler(400, "Invalid role");
        }

    res.json(email);

});

