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
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userSkills = await prisma.userSkill.findMany({
      where: { userId: user.id },
      include: { skill: true },
    });
    return NextResponse.json(userSkills);
  } catch (error) {
    console.error("Error fetching user skills:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { skillId, proficiency, years } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userSkill = await prisma.userSkill.create({
      data: {
        userId: user.id,
        skillId,
        proficiency,
        years: parseFloat(years),
      },
    });

    return NextResponse.json(userSkill);
  } catch (error) {
    console.error("Error adding user skill:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get("skillId");
    if (!skillId) return NextResponse.json({ error: "Missing skillId" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.userSkill.delete({
      where: {
        userId_skillId: {
          userId: user.id,
          skillId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user skill:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
