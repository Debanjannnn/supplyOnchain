import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../db/src/index"

export async function POST(req: NextRequest) {
    const {batchId, step, location, holder, message} = await req.json();

    if (!batchId || !step || !location || !holder) {
        return NextResponse.json({ error: "Missing batchId, step, location, or holder" }, { status: 400 });
    }

    const productexists = await prisma.product.findUnique({
        where: {
            batchId: batchId
        }
    })
    const holderexists = await prisma.participant.findUnique({
        where: {
            pubKey: holder
        }
    })
    if (!productexists) {
        return NextResponse.json({ error: "Product does not exist" }, { status: 400 });
    }
    if (!holderexists) {
        return NextResponse.json({ error: "Holder does not exist" }, { status: 400 });
    }

    const producttrack = await prisma.productTrack.create({
        data: {
            batchId,
            step,
            location,
            holder,
            message
        }
    })

    return NextResponse.json({ message: "Product track created", producttrack });
}