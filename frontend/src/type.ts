import React,{ReactNode} from "react";

export interface Joboptions {
  title: string;
  responsibilities: string;
  why: string;
}

export interface SkillsToLearn {
  title: string;
  why: string;
  how: string;
}

export interface SkillCategory {
  category: string;
  skills: SkillsToLearn[];
}

export interface LearningApproach {
  title: string;
  points: string[];
}

export interface CarrerGuideResponse {
  summary: string;
  jobOptions: Joboptions[];
  skillsToLearn: SkillCategory[];
  learningApproach: LearningApproach;
}

export interface User {
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


export interface AppContextType{

    user: User | null;
    loading: boolean;
    btnLoading: boolean;
    isAuth:boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;

}

export interface AppProviderProps{
    children: React.ReactNode;
}