import { getAdminSecret } from "@/lib/config";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { secret: string } }
) {
  try {
    if (params.secret != await getAdminSecret()) {
      return Response.json({ errorMessage: "You are not the admin!" }, { status: 403 })
    }

    // Update all invites to reset their sent status
    await prisma.invite.updateMany({
      data: {
        whatsappSent: null,
        telegramSent: null,
      }
    });

    // Fetch and return all updated invites
    const invites = await prisma.invite.findMany();
    
    return NextResponse.json(invites);
  } catch (error) {
    return NextResponse.json(
      { errorMessage: `Failed to reset sent status: ${error}` },
      { status: 500 }
    );
  }
}
