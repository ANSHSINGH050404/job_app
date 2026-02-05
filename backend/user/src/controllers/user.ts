import { AuthenticatedRequest } from "../middleware/auth";
import { sql } from "../utils/db";
import { TryCatch } from "../utils/try_catch";


export const myProfile = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    res.json(user);
  },
);

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
      return res.status(404).json({ message: 'User not found' });
    }
 
  
    
      const user=users[0];
      return res.status(200).json(user);
    
    
  },
);
