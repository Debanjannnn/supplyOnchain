import { NextRequest, NextResponse } from "next/server";

import prisma from "../../../../db/src/index";

export async function POST(req: NextRequest) {
  const { name, batchId, description, price, quantity, category, manufacturerKey } = await req.json();

  if (!name || !batchId || !description || !price || !quantity || !category || !manufacturerKey) {
    return NextResponse.json(
      { error: "Missing name, batchId, description, price, quantity, category, or manufacturerKey" },
      { status: 400 },
    );
  }
  const allowedTypes = ["FOOD", "ELECTRONICS", "MEDICINE", "FASHION", "OTHER"];
  if (!allowedTypes.includes(category)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  const checkbatchid = await prisma.product.findUnique({
    where: {
      batchId: batchId,
    },
  });
  if (checkbatchid) {
    return NextResponse.json({ error: "Batch ID already exists" }, { status: 400 });
  }
  const checkmanufacturerkey = await prisma.participant.findUnique({
    where: {
      pubKey: manufacturerKey,
    },
  });
  if (!checkmanufacturerkey) {
    return NextResponse.json({ error: "Manufacturer key does not exist" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      batchId,
      description,
      price,
      quantity,
      category,
      manufacturerKey,
    },
  });

  return NextResponse.json({ message: "Product created", product });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get('batchId');
    let products;
    if (batchId) {
      products = await prisma.product.findMany({
        where: { batchId },
        orderBy: { createdAt: 'asc' },
      });
    } else {
      products = await prisma.product.findMany({
        orderBy: { createdAt: 'asc' },
      });
    }
    return NextResponse.json({ products });
  } catch (error) {
    console.error('[GET /api/product] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}