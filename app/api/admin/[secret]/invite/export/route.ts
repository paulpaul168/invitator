import { isAdminSecret } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ secret: string }> }
) {
    try {
        const { secret } = await params;
        if (!(await isAdminSecret(secret))) {
            return NextResponse.json({ errorMessage: "You are not the admin!" }, { status: 403 })
        }

        const invites = await prisma.invite.findMany();

        const exportData = {
            exportDate: new Date().toISOString(),
            version: 1,
            invites: invites,
        };

        return NextResponse.json(exportData);
    } catch (error) {
        return NextResponse.json(
            { errorMessage: "Failed to export" },
            { status: 500 }
        );
    }
}

