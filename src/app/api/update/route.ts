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