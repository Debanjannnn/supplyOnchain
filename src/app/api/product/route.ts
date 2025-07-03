import { NextRequest, NextResponse } from "next/server"

// import prisma from "../../../../db/src/index" 

export async function GET(req: NextRequest) {
    
    return NextResponse.json({ message: "Product route" });
}
