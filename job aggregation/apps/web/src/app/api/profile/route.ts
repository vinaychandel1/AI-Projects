import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@skillmatch/db";

export async function GET() {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { headline, bio, yearsExperience, city, remotePreference } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        headline,
        bio,
        yearsExperience: yearsExperience ? parseInt(yearsExperience, 10) : null,
        city,
        remotePreference: remotePreference ? [remotePreference] : [],
      },
      create: {
        userId: user.id,
        headline,
        bio,
        yearsExperience: yearsExperience ? parseInt(yearsExperience, 10) : null,
        city,
        remotePreference: remotePreference ? [remotePreference] : [],
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
