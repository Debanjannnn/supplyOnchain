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

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const batchId = searchParams.get('batchId');
        let tracks;
        if (batchId) {
            tracks = await prisma.productTrack.findMany({
                where: { batchId },
                orderBy: { createdAt: 'asc' },
            });
        } else {
            tracks = await prisma.productTrack.findMany({
                orderBy: { createdAt: 'asc' },
            });
        }
        return NextResponse.json({ tracks });
    } catch (error) {
        console.error('[GET /api/track] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}