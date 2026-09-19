import { NextResponse } from "next/server";
import { prisma } from "@skillmatch/db";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { popularity: 'desc' },
      take: 50,
    });
    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
