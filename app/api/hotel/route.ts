import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    const hotel = await prismadb.hotel.create({
      data: {
        ...body,
        userId,
      },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.log("Error at /api/hotel POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
