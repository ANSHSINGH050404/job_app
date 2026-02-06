export interface Joboptions{
    title: string;
    responsibilities: string;
    why: string;
}


export interface SkillsToLearn{
   title: string;
   why: string;
   how:string;
}

export interface SkillCategory{
    category: string;
    skills: SkillsToLearn[];
}


export interface LearningApproach{
    title: string;
    points: string[];

}


export interface CarrerGuideResponse{
    summary: string;
    jobOptions: Joboptions[];
    skillsToLearn: SkillCategory[];
    learningApproach: LearningApproach;
}

export const utils_services = "http://localhost:5001";