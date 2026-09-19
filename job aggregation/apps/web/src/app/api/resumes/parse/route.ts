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
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "Missing resume file" }, { status: 400 });
    }

    const text = await file.text();
    const aiProvider = new MockAIProvider();
    const parsedData = await aiProvider.parseResume(text);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Save parsed profile info
    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        headline: parsedData.headline,
        yearsExperience: parsedData.yearsExperience,
        bio: parsedData.summary,
      },
      create: {
        userId: user.id,
        headline: parsedData.headline || "Full Stack Engineer",
        yearsExperience: parsedData.yearsExperience,
        bio: parsedData.summary,
      },
    });

    // Populate parsed skills into the UserSkill and Skill tables
    if (parsedData.skills) {
      for (const s of parsedData.skills) {
        const slug = s.name.toLowerCase().replace(/\s+/g, "-");
        const skill = await prisma.skill.upsert({
          where: { slug },
          update: {},
          create: {
            slug,
            canonicalName: s.name,
          },
        });

        await prisma.userSkill.upsert({
          where: {
            userId_skillId: {
              userId: user.id,
              skillId: skill.id,
            },
          },
          update: {
            proficiency: s.proficiency as any,
            years: s.years,
          },
          create: {
            userId: user.id,
            skillId: skill.id,
            proficiency: s.proficiency as any,
            years: s.years,
          },
        });
      }
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error parsing resume:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
