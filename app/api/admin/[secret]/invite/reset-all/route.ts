import { isAdminSecret } from "@/lib/auth";
import { AcceptState } from "@/lib/accept-state";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ secret: string }> }
) {
  try {
    const { secret } = await params;
    if (!(await isAdminSecret(secret))) {
      return NextResponse.json({ errorMessage: "You are not the admin!" }, { status: 403 })
    }

    // Reset all invites - keep only name, fullName, phone, token
    await prisma.invite.updateMany({
      data: {
        accepted: AcceptState.Pending,
        plusOne: 0,
        whatsappSent: null,
        telegramSent: null,
      }
    });

    // Fetch and return all updated invites
    const invites = await prisma.invite.findMany();
    
    return NextResponse.json(invites);
  } catch (error) {
    return NextResponse.json(
      { errorMessage: "Failed to reset all" },
      { status: 500 }
    );
  }
}

