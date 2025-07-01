import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const jobs = await prisma.jobApplication.findMany({ orderBy: { dateApplied: "desc" } });
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const job = await prisma.jobApplication.create({ data });
  return NextResponse.json(job, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  if (!data.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const job = await prisma.jobApplication.update({ where: { id: data.id }, data });
  return NextResponse.json(job);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.jobApplication.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 