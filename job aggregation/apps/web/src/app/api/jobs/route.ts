import { NextResponse } from "next/server";
import { prisma } from "@skillmatch/db";

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      take: 20,
      include: {
        company: true,
      },
      orderBy: {
        postedAt: "desc",
      },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
