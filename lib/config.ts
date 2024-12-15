import { readFile } from 'fs/promises';

export type EventDetails = {
    location: string;
    date: string;
    groupChat: string;
    title: string;
    description: {
        intro: string;
        paragraphs: string[];
    };
    eventInfo: {
        title: string;
        durationHours: number;
        details: Array<{
            title: string;
            text: string;
        }>;
    };
}

export async function getEventDetails(): Promise<EventDetails> {
    let config = JSON.parse(await readFile("./invitator.json", "utf-8"))
    return {
        location: config.location,
        date: config.date,
        groupChat: config.groupChat,
        title: config.eventInfo.title,
        description: config.description,
        eventInfo: config.eventInfo
    }
}

export async function getAdminSecret(): Promise<string> {
    let config = JSON.parse(await readFile("./invitator.json", "utf-8"))
    return config.adminSecret
}