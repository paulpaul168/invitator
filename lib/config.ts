import { readFile } from 'fs/promises';

export interface EventDetails {
    date: string;
    location: string;
    groupChat: string;
    maxPlusOne: number;
    eventInfo: {
        title: string;
        durationHours: number;
    };
    description: {
        intro: string;
        paragraphs: string[];
    };
    hardFacts: {
        title: string;
        subtitle: string;
        sections: {
            title: string;
            content: string;
        }[];
    };
}

export async function getEventDetails(): Promise<EventDetails> {
    let config = JSON.parse(await readFile("./invitator.json", "utf-8"))
    return {
        location: config.location,
        date: config.date,
        groupChat: config.groupChat,
        title: config.eventInfo.title,
        maxPlusOne: config.maxPlusOne,
        description: config.description,
        eventInfo: config.eventInfo,
        hardFacts: config.hardFacts
    }
}

export async function getAdminSecret(): Promise<string> {
    let config = JSON.parse(await readFile("./invitator.json", "utf-8"))
    return config.adminSecret
}