import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@skillmatch/db";
import { MockAIProvider } from "@skillmatch/core";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { jobId } = await request.json();
    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true, skills: { include: { skill: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const aiProvider = new MockAIProvider();
    const userProfileText = `Headline: ${user.profile?.headline || ""}. Bio: ${user.profile?.bio || ""}. Skills: ${user.skills.map((s) => s.skill.canonicalName).join(", ")}`;
    const jobDescriptionText = `${job.title} at ${job.company.name}. Description: ${job.description}`;

    const matchResult = await aiProvider.matchJob(userProfileText, jobDescriptionText);

    const jobMatch = await prisma.jobMatch.upsert({
      where: {
        userId_jobId: {
          userId: user.id,
          jobId: job.id,
        },
      },
      update: {
        score: matchResult.score,
        explanation: matchResult.reason,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills,
      },
      create: {
        userId: user.id,
        jobId: job.id,
        score: matchResult.score,
        explanation: matchResult.reason,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills,
      },
    });

    return NextResponse.json({ success: true, match: jobMatch });
  } catch (error) {
    console.error("Error matching job:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
