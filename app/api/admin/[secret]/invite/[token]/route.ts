import { isAdminSecret } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AcceptState } from "@/lib/accept-state";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ secret: string; token: string }> }
) {
  try {
    const { secret, token } = await params;

    if (!(await isAdminSecret(secret))) {
      return NextResponse.json({ errorMessage: "You are not the admin!" }, { status: 403 });
    }

    const body = await request.json();

    const data: {
      whatsappSent?: Date | null;
      telegramSent?: Date | null;
      accepted?: string;
      plusOne?: number;
    } = {};

    if ("whatsappSent" in body) {
      data.whatsappSent = body.whatsappSent ? new Date(body.whatsappSent) : null;
    }
    if ("telegramSent" in body) {
      data.telegramSent = body.telegramSent ? new Date(body.telegramSent) : null;
    }
    if ("accepted" in body) {
      if (!Object.values(AcceptState).includes(body.accepted as AcceptState)) {
        return NextResponse.json({ errorMessage: "Invalid accept state" }, { status: 400 });
      }
      data.accepted = body.accepted;
    }
    if ("plusOne" in body) {
      if (typeof body.plusOne !== "number" || !Number.isInteger(body.plusOne) || body.plusOne < 0) {
        return NextResponse.json({ errorMessage: "Invalid plusOne" }, { status: 400 });
      }
      data.plusOne = body.plusOne;
    }

    const invite = await prisma.invite.update({
      where: {
        token,
      },
      data,
    });

    return NextResponse.json(invite);
  } catch {
    return NextResponse.json(
      { errorMessage: "Failed to update invite" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ secret: string; token: string }> }
) {
  try {
    const { secret, token } = await params;

    if (!(await isAdminSecret(secret))) {
      return NextResponse.json({ errorMessage: "You are not the admin!" }, { status: 403 });
    }

    await prisma.invite.delete({
      where: {
        token,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { errorMessage: "Failed to delete invite" },
      { status: 500 }
    );
  }
}
