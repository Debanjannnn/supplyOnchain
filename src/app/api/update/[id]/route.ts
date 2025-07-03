import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../db/src/index";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const update = await prisma.productUpdate.findUnique({ where: { id } });
  if (!update) {
    return NextResponse.json({ error: "Update not found" }, { status: 404 });
  }
  return NextResponse.json({ update });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();
  try {
    const updated = await prisma.productUpdate.update({ where: { id }, data });
    return NextResponse.json({ update: updated });
  } catch (e) {
    return NextResponse.json({ error: "Update not found or update failed" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.productUpdate.delete({ where: { id } });
    return NextResponse.json({ message: "Update deleted" });
  } catch (e) {
    return NextResponse.json({ error: "Update not found or delete failed" }, { status: 404 });
  }
} 