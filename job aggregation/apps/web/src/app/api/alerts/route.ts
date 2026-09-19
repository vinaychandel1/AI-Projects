import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@skillmatch/db";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { query, frequency } = await request.json();
  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const alert = await prisma.jobAlert.create({
    data: {
      userId: user.id,
      query: query,
      frequency: frequency || "DAILY",
    },
  });

  return NextResponse.json({ success: true, alert });
}
