import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../db/src/index";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const track = await prisma.productTrack.findUnique({ where: { id } });
  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }
  return NextResponse.json({ track });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();
  try {
    const updated = await prisma.productTrack.update({ where: { id }, data });
    return NextResponse.json({ track: updated });
  } catch (e) {
    return NextResponse.json({ error: "Track not found or update failed" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.productTrack.delete({ where: { id } });
    return NextResponse.json({ message: "Track deleted" });
  } catch (e) {
    return NextResponse.json({ error: "Track not found or delete failed" }, { status: 404 });
  }
} 