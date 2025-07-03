import { NextRequest, NextResponse } from "next/server"

import prisma from "../../../../db/src/index" 

export async function POST(req: NextRequest) {
    try {
      const { pubKey, roleType ,name} = await req.json();
  
      if (!pubKey || !roleType) {
        return NextResponse.json({ error: "Missing pubKey or roleType" }, { status: 400 });
      }
  
      const allowedTypes = ["MANUFACTURER", "SUPPLIER", "CONSUMER"];
      if (!allowedTypes.includes(roleType)) {
        return NextResponse.json({ error: "Invalid roleType" }, { status: 400 });
      }
  
      const role = await prisma.role.create({
        data: {
            pubKey,
            name,
            roleType,
        }
      })    
  
      return NextResponse.json({ message: "Role created or updated", role });
    } catch (error) {
      console.error("[POST /api/role] Error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

//   where: { pubKey },
//   update: {
//     roleType, 
//   },
//   create: {
//     pubKey,
//     roleType,
//   },