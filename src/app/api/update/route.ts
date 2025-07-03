import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../db/src/index"

export async function POST(req: NextRequest) {
    const {batchId, signatures} = await req.json();

    if (!batchId || !signatures) {
        return NextResponse.json({ error: "Missing batchId or signatures" }, { status: 400 });
    }

    const productexists = await prisma.product.findUnique({
        where: {
            batchId: batchId
        }
    })
    if (!productexists) {
        return NextResponse.json({ error: "Product does not exist" }, { status: 400 });
    }

    const productupdate = await prisma.productUpdate.create({
        data: {
            batchId,
            signatures
        }
    })

    return NextResponse.json({ message: "Product update created", productupdate });
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const batchId = searchParams.get('batchId');
        let updates;
        if (batchId) {
            updates = await prisma.productUpdate.findMany({
                where: { batchId },
                orderBy: { createdAt: 'asc' },
            });
        } else {
            updates = await prisma.productUpdate.findMany({
                orderBy: { createdAt: 'asc' },
            });
        }
        return NextResponse.json({ updates });
    } catch (error) {
        console.error('[GET /api/update] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}