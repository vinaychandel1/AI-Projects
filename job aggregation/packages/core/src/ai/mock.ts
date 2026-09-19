import { AIProviderInterface } from "./base";

export class MockAIProvider implements AIProviderInterface {
  name = "mock_ai";

  async generateEmbeddings(text: string): Promise<number[]> {
    // Return a mock 1536-dimensional vector for pgvector
    const vector = new Array(1536).fill(0).map(() => Math.random() * 0.1);
    return vector;
  }

  async parseResume(text: string): Promise<{
    headline?: string;
    yearsExperience?: number;
    skills?: { name: string; proficiency?: string; years?: number }[];
    educationLevel?: string;
    summary?: string;
  }> {
    return {
      headline: "Full Stack Software Engineer",
      yearsExperience: 4,
      skills: [
        { name: "TypeScript", proficiency: "EXPERT", years: 4 },
        { name: "React", proficiency: "ADVANCED", years: 3 },
        { name: "Node.js", proficiency: "ADVANCED", years: 3 },
        { name: "PostgreSQL", proficiency: "INTERMEDIATE", years: 2 },
      ],
      educationLevel: "BACHELOR",
      summary: "Experienced software engineer with expertise in TypeScript, React, and Node.js.",
    };
  }

  async matchJob(userProfileText: string, jobDescriptionText: string): Promise<{
    score: number;
    reason: string;
    matchedSkills: string[];
    missingSkills: string[];
  }> {
    return {
      score: 88,
      reason: "Strong alignment in TypeScript and React experience, matching core requirements.",
      matchedSkills: ["TypeScript", "React", "Node.js"],
      missingSkills: ["Docker"],
    };
  }
}
