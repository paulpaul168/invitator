import { isAdminSecret } from "@/lib/auth";
import { AcceptState } from "@/lib/accept-state";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

function isValidAcceptState(value: unknown): value is AcceptState {
  return typeof value === "string" && Object.values(AcceptState).includes(value as AcceptState);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ secret: string }> }
) {
  try {
    const { secret } = await params;
    if (!(await isAdminSecret(secret))) {
      return NextResponse.json({ errorMessage: "You are not the admin!" }, { status: 403 })
    }

    const body = await request.json();
    
    if (!body.invites || !Array.isArray(body.invites)) {
      return NextResponse.json(
        { errorMessage: "Invalid import format: missing invites array" },
        { status: 400 }
      );
    }

    let imported = 0;
    let skipped = 0;
    let errors: string[] = [];

    for (const invite of body.invites) {
      try {
        if (typeof invite?.name !== "string" || typeof invite?.fullName !== "string" || !invite.name || !invite.fullName) {
          errors.push("Skipped invite with missing name/fullName");
          skipped++;
          continue;
        }

        if (invite.accepted != null && !isValidAcceptState(invite.accepted)) {
          errors.push(`Invalid accept state for ${invite.fullName}`);
          skipped++;
          continue;
        }

        const plusOne = typeof invite.plusOne === "number" && Number.isInteger(invite.plusOne) && invite.plusOne >= 0
          ? invite.plusOne
          : 0;

        // Check if invite with this fullName already exists
        const existing = await prisma.invite.findUnique({
          where: { fullName: invite.fullName }
        });

        if (existing) {
          // Update existing invite
          await prisma.invite.update({
            where: { fullName: invite.fullName },
            data: {
              name: invite.name,
              phone: typeof invite.phone === "string" ? invite.phone : null,
              accepted: isValidAcceptState(invite.accepted) ? invite.accepted : AcceptState.Pending,
              plusOne,
              whatsappSent: invite.whatsappSent ? new Date(invite.whatsappSent) : null,
              telegramSent: invite.telegramSent ? new Date(invite.telegramSent) : null,
            }
          });
          imported++;
        } else {
          // Always mint a fresh token; ignore client-supplied tokens
          await prisma.invite.create({
            data: {
              name: invite.name,
              fullName: invite.fullName,
              token: randomBytes(16).toString("hex"),
              phone: typeof invite.phone === "string" ? invite.phone : null,
              accepted: isValidAcceptState(invite.accepted) ? invite.accepted : AcceptState.Pending,
              plusOne,
              whatsappSent: invite.whatsappSent ? new Date(invite.whatsappSent) : null,
              telegramSent: invite.telegramSent ? new Date(invite.telegramSent) : null,
            }
          });
          imported++;
        }
      } catch {
        errors.push(`Failed to import ${invite?.fullName ?? "unknown"}`);
        skipped++;
      }
    }

    const invites = await prisma.invite.findMany();

    return NextResponse.json({
      message: `Imported ${imported} invites, skipped ${skipped}`,
      imported,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
      invites,
    });
  } catch {
    return NextResponse.json(
      { errorMessage: "Failed to import" },
      { status: 500 }
    );
  }
}

