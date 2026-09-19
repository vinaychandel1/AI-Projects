import { JobSourceAdapter, JobListingInput } from "./base";

export class MockJobSourceAdapter implements JobSourceAdapter {
  key = "mock_source";
  displayName = "SkillMatch Mock Jobs";

  async fetchListings(cursor?: string): Promise<{ listings: JobListingInput[]; nextCursor?: string }> {
    const mockJobs: JobListingInput[] = [
      {
        sourceJobId: "mock-1",
        title: "Senior Full Stack Engineer",
        companyName: "Acme Corp",
        jobUrl: "https://example.com/jobs/senior-full-stack",
        applyUrl: "https://example.com/apply/senior-full-stack",
        locationRaw: "San Francisco, CA",
        description: "We are looking for a Senior Full Stack Engineer experienced with Next.js, React, TypeScript, and PostgreSQL to build scalable web applications.",
        salaryMin: 140000,
        salaryMax: 180000,
        salaryCurrency: "USD",
        remoteType: "REMOTE",
        employmentType: "FULL_TIME",
        postedAt: new Date(),
      },
      {
        sourceJobId: "mock-2",
        title: "AI / ML Engineer",
        companyName: "NeuralTech",
        jobUrl: "https://example.com/jobs/ai-ml-engineer",
        applyUrl: "https://example.com/apply/ai-ml-engineer",
        locationRaw: "New York, NY",
        description: "Join our core AI team to build vector search, semantic embeddings integration, and LLM-powered matching pipelines using Python and TypeScript.",
        salaryMin: 160000,
        salaryMax: 210000,
        salaryCurrency: "USD",
        remoteType: "HYBRID",
        employmentType: "FULL_TIME",
        postedAt: new Date(),
      },
      {
        sourceJobId: "mock-3",
        title: "Frontend Developer",
        companyName: "PixelCraft",
        jobUrl: "https://example.com/jobs/frontend-dev",
        applyUrl: "https://example.com/apply/frontend-dev",
        locationRaw: "Austin, TX",
        description: "Looking for a passionate Frontend Developer with deep expertise in Tailwind CSS, React, and modern UI/UX design systems.",
        salaryMin: 120000,
        salaryMax: 150000,
        salaryCurrency: "USD",
        remoteType: "REMOTE",
        employmentType: "FULL_TIME",
        postedAt: new Date(),
      },
    ];

    return {
      listings: mockJobs,
      nextCursor: undefined,
    };
  }
}
