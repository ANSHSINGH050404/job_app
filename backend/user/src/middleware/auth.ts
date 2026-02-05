import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sql } from "../utils/db";


interface User {
  user_id: string;
  name: string;
  email: string;
  phone_number: string;
  role: "jobseeker" | "recruiter";
  bio: string | null;
  resume: string | null;
  resume_public_id: string | null;
  profile_picture: string | null;
  profile_picture_public_id: string | null;
  skills: string[];
  subscription: string | null;
}


export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication Header Missing or Invalid' });
        }
        
        const token = authHeader.split(' ')[1];
        console.log('Extracted Token:', token);
        if (!token) {
            return res.status(401).json({ message: 'Authentication Token Missing' });
        }
        
        const decodedPayload = jwt.verify(
            token, 
            process.env.JWT_SECRET_KEY as string
        ) as JwtPayload;
        console.log('Decoded JWT Payload:', decodedPayload);
        
        console.log('Decoded JWT Payload:', decodedPayload);
        if (!decodedPayload || !decodedPayload.id) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        
        const users = await sql`
            SELECT u.user_id, u.name, u.email, u.phone_number, u.role, u.bio, 
                   u.resume, u.resume_public_id, u.profile_picture, 
                   u.profile_picture_public_id, u.subscription,
                   ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) AS skills
            FROM users u
            LEFT JOIN user_skills us ON u.user_id = us.user_id
            LEFT JOIN skills s ON us.skill_id = s.skill_id
            WHERE u.user_id = ${decodedPayload.id}
            GROUP BY u.user_id;
        `;
        
        if (!users || users.length === 0) {
            return res.status(401).json({ message: 'User associated with token not found' });
        }

        console.log(users);
        
        
        const user = users[0] as User;
        user.skills = user.skills || [];
        req.user = user;
        next();
        
    } catch (error: any) {
        console.error('Authentication Error:', error);
        
        // JWT-specific errors should return 401
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Authentication Failed', error: error.message });
        }
        
        // Other errors (like DB errors) should return 500
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


