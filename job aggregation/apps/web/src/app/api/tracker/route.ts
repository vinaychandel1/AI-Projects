import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@skillmatch/db";

// GET user jobs in tracker
export async function GET(request: Request) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const applications = await prisma.jobApplication.findMany({
    where: { userId: user.id },
    include: { job: { include: { company: true } } },
  });

  return NextResponse.json({ applications });
}

// POST update tracker status
export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobId, status } = await request.json();
  if (!jobId || !status) {
    return NextResponse.json({ error: "Missing jobId or status" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const application = await prisma.jobApplication.upsert({
    where: {
      userId_jobId: {
        userId: user.id,
        jobId: jobId,
      },
    },
    update: {
      status: status,
    },
    create: {
      userId: user.id,
      jobId: jobId,
      status: status,
    },
  });

  return NextResponse.json({ success: true, application });
}
