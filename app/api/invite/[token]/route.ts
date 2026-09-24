import { getInviteByToken, updateInviteRsvp } from "@/lib/invite-service";
import { getEventDetails } from "@/lib/config";
import { AcceptState } from "@/lib/accept-state";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const existing = await getInviteByToken(token);
  if (existing == null) {
    return Response.json({ errorMessage: "Invite not found" }, { status: 404 });
  }

  let body: { accepted?: string; plusOne?: number };
  try {
    body = await request.json();
  } catch {
    return Response.json({ errorMessage: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.accepted !== "string" || typeof body.plusOne !== "number") {
    return Response.json(
      { errorMessage: "accepted and plusOne are required" },
      { status: 400 }
    );
  }

  if (!Number.isInteger(body.plusOne)) {
    return Response.json(
      { errorMessage: "plusOne must be an integer" },
      { status: 400 }
    );
  }

  if (!Object.values(AcceptState).includes(body.accepted as AcceptState)) {
    return Response.json({ errorMessage: "Invalid accept state" }, { status: 400 });
  }

  const eventDetails = await getEventDetails();
  if (body.plusOne < 0) {
    return Response.json(
      {
        errorMessage:
          "I know you don't have many friends, but let's keep it positive.",
      },
      { status: 400 }
    );
  }
  if (body.plusOne > eventDetails.maxPlusOne) {
    return Response.json(
      {
        errorMessage: `Sorry, you can only bring up to ${eventDetails.maxPlusOne} additional guests.`,
      },
      { status: 400 }
    );
  }

  try {
    const updatedInvite = await updateInviteRsvp(
      token,
      body.accepted,
      body.plusOne
    );
    return Response.json(updatedInvite);
  } catch {
    return Response.json(
      { errorMessage: "Failed to update invite" },
      { status: 500 }
    );
  }
}
