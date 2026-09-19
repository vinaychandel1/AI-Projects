export interface AIProviderInterface {
  name: string;
  generateEmbeddings(text: string): Promise<number[]>;
  parseResume(text: string): Promise<{
    headline?: string;
    yearsExperience?: number;
    skills?: { name: string; proficiency?: string; years?: number }[];
    educationLevel?: string;
    summary?: string;
  }>;
  matchJob(userProfileText: string, jobDescriptionText: string): Promise<{
    score: number;
    reason: string;
    matchedSkills: string[];
    missingSkills: string[];
  }>;
}
