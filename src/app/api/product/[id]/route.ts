import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../db/src/index";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();
  try {
    const updated = await prisma.product.update({ where: { id }, data });
    return NextResponse.json({ product: updated });
  } catch (e) {
    return NextResponse.json({ error: "Product not found or update failed" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Product deleted" });
  } catch (e) {
    return NextResponse.json({ error: "Product not found or delete failed" }, { status: 404 });
  }
} 