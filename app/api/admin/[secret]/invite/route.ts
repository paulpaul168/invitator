import { getAdminSecret } from "@/lib/config";
import { createInvite, getAllInvites } from "@/lib/invite-service";

export async function GET(request: Request, { params }: { params: { secret: string } }) {

    if (params.secret != await getAdminSecret()) {
        return Response.json({ errorMessage: "You are not the admin!" }, { status: 403 })
    }

    return Response.json(await getAllInvites())
}

export async function POST(request: Request, { params }: { params: { secret: string } }) {

    if (params.secret != await getAdminSecret()) {
        return Response.json({ errorMessage: "You are not the admin!" }, { status: 403 })
    }

    let newInvite: { name: string, fullName: string, phone?: string } = await request.json()
    if (newInvite.fullName == "" || newInvite.name == "") {
        return Response.json({ errorMessage: "The name and full name must not be empty" }, { status: 403 })
    }

    if (newInvite.phone && !/^\+?[\d\s-]+$/.test(newInvite.phone)) {
        return Response.json({ errorMessage: "Invalid phone number format" }, { status: 403 })
    }

    return Response.json(await createInvite(newInvite.name, newInvite.fullName, newInvite.phone))
}