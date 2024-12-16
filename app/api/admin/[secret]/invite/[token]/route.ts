import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { secret: string, token: string } }
) {
  try {
    const body = await request.json();

    const invite = await prisma.invite.update({
      where: {
        token: params.token
      },
      data: {
        whatsappSent: body.whatsappSent ? new Date(body.whatsappSent) : null,
        telegramSent: body.telegramSent ? new Date(body.telegramSent) : null,
        accepted: body.accepted,
        plusOne: body.plusOne
      }
    });

    return NextResponse.json(invite);
  } catch (error) {
    return NextResponse.json(
      { errorMessage: `Failed to update invite: ${error}` },
      { status: 500 }
    );
  }
}
