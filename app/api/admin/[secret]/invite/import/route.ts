import { getAdminSecret } from "@/lib/config";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { secret: string } }
) {
  try {
    if (params.secret !== await getAdminSecret()) {
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
              phone: invite.phone || null,
              accepted: invite.accepted,
              plusOne: invite.plusOne || 0,
              whatsappSent: invite.whatsappSent ? new Date(invite.whatsappSent) : null,
              telegramSent: invite.telegramSent ? new Date(invite.telegramSent) : null,
            }
          });
          imported++;
        } else {
          // Create new invite
          await prisma.invite.create({
            data: {
              name: invite.name,
              fullName: invite.fullName,
              token: invite.token || crypto.randomUUID(),
              phone: invite.phone || null,
              accepted: invite.accepted,
              plusOne: invite.plusOne || 0,
              whatsappSent: invite.whatsappSent ? new Date(invite.whatsappSent) : null,
              telegramSent: invite.telegramSent ? new Date(invite.telegramSent) : null,
            }
          });
          imported++;
        }
      } catch (error) {
        errors.push(`Failed to import ${invite.fullName}: ${error}`);
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
  } catch (error) {
    return NextResponse.json(
      { errorMessage: `Failed to import: ${error}` },
      { status: 500 }
    );
  }
}

