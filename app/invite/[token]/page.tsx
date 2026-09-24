import { getInviteByToken } from "@/lib/invite-service";
import { notFound } from "next/navigation";
import InviteForm from "./invite-form";
import { getEventDetails } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params
    let invite = await getInviteByToken(token)
    if (invite == null) {
        return notFound()
    }

    let eventDetails = await getEventDetails()

    return {
        title: `Hallo ${invite.name}!`,
        description: `Einladung zur ${eventDetails.eventInfo.title}, am ${eventDetails.date}. Klicke hier um zu- oder abzusagen.`
    }
}

export default async function Invite({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params
    let invite = await getInviteByToken(token)
    if (invite == null) {
        return notFound()
    }

    let eventDetails = await getEventDetails()

    return (
        <InviteForm invite={invite} event={eventDetails}></InviteForm>
    );
}
