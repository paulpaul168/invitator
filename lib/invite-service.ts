import prisma from './prisma';
import { Invite } from '@prisma/client'
import { AcceptState } from './accept-state';
import { randomBytes } from 'crypto';


export async function getAllInvites(): Promise<Invite[]> {
    return await prisma.invite.findMany()
}

export async function getInviteByToken(token: string): Promise<Invite | null> {
    return await prisma.invite.findFirst({
        where: { token: token }
    })
}

export async function createInvite(name: string, fullName: string, phone?: string): Promise<Invite> {
    const token = randomBytes(16).toString("hex");
    return await prisma.invite.create({
        data: {
            name: name,
            fullName: fullName,
            token: token,
            accepted: AcceptState.Pending,
            plusOne: 0,
            phone: phone
        }
    })
}

export async function updateInviteRsvp(
    token: string,
    accepted: string,
    plusOne: number
): Promise<Invite> {
    if (!Object.values(AcceptState).includes(accepted as AcceptState)) {
        throw new Error("Invalid accept state");
    }

    return await prisma.invite.update({
        where: { token },
        data: {
            accepted,
            plusOne,
        }
    })
}

export async function deleteInvite(token: string) {
    await prisma.invite.delete({ where: { token: token } })
}
