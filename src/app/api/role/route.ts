import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../db/src/index";



export async function POST(req: NextRequest) {
  try {
    const { name, pubKey, role } = await req.json();

    if (!name || !pubKey || !role) {
      return NextResponse.json({ error: "Missing name, pubKey, or role" }, { status: 400 });
    }

    // Check if pubKey already exists
    const pubkeyfind = await prisma.participant.findUnique({
      where: { pubKey },
    });

    if (pubkeyfind) {
      return NextResponse.json({ error: "Pubkey already exists" }, { status: 400 });
    }

    const allowedTypes = ["MANUFACTURER", "SUPPLIER", "DISTRIBUTOR", "RETAILER"];
    if (!allowedTypes.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Create new participant
    const roleCreated = await prisma.participant.create({
      data: {
        name,
        pubKey,
        role,
        createdAt: new Date(),
      },
    });

    console.log(roleCreated);

    return NextResponse.json({ message: "Role created", role: roleCreated });
  } catch (error) {
    console.error("[POST /api/role] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pubKey = searchParams.get("pubKey");
    if (pubKey) {
      const participant = await prisma.participant.findUnique({
        where: { pubKey },
      });
      if (!participant) {
        return NextResponse.json({ error: "Participant not found" }, { status: 404 });
      }
      return NextResponse.json({ participant });
    }
    const participants = await prisma.participant.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ participants });
  } catch (error) {
    console.error("[GET /api/role] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
