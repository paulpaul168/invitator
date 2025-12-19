import { getAdminSecret } from "@/lib/config";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { secret: string } }
) {
    try {
        if (params.secret !== await getAdminSecret()) {
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
            { errorMessage: `Failed to export: ${error}` },
            { status: 500 }
        );
    }
}

