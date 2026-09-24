import { isAdminSecret } from "@/lib/auth";
import { getEventDetails } from "@/lib/config";
import { getAllInvites } from "@/lib/invite-service";
import { notFound } from "next/navigation";
import Dashboard from "./dashboard";

export default async function Admin({ params }: { params: Promise<{ secret: string }> }) {
    const { secret } = await params

    if (!(await isAdminSecret(secret))) {
        return notFound()
    }

    let eventDetails = await getEventDetails()
    let invites = await getAllInvites()

    return (
        <Dashboard invites={invites} event={eventDetails} adminSecret={secret}></Dashboard>
    )

}
