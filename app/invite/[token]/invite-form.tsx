'use client'

import { Invite } from "@prisma/client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { AcceptState } from "@/lib/accept-state";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { EventDetails } from "@/lib/config";

function generateICSContent(event: EventDetails) {
    try {
        let eventDate: Date | null = null;

        // Try parsing DD.MM.YYYY HH:mm format first
        const dateTimeMatch = event.date.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})/);
        if (dateTimeMatch) {
            const [_, day, month, year, hours, minutes] = dateTimeMatch;
            eventDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hours),
                parseInt(minutes)
            );
        }

        // If still invalid, try other formats as fallback
        if (!eventDate || isNaN(eventDate.getTime())) {
            // Try direct Date parsing
            eventDate = new Date(event.date);

            // If invalid, try European format (DD.MM.YYYY)
            if (isNaN(eventDate.getTime())) {
                const [day, month, year] = event.date.split('.').map(n => parseInt(n, 10));
                eventDate = new Date(year, month - 1, day);
            }

            // If invalid, try format like "30. November 19:00"
            if (isNaN(eventDate.getTime())) {
                const months: { [key: string]: number } = {
                    'january': 0, 'februar': 1, 'march': 2, 'april': 3,
                    'may': 4, 'june': 5, 'july': 6, 'august': 7,
                    'september': 8, 'october': 9, 'november': 10, 'december': 11
                };

                const match = event.date.toLowerCase().match(/(\d+)\.\s*(\w+)(?:\s+(\d{1,2}):(\d{2}))?/);
                if (match) {
                    const [_, day, monthStr, hours = "0", minutes = "0"] = match;
                    const month = months[monthStr];

                    if (month !== undefined) {
                        const currentYear = new Date().getFullYear();
                        eventDate = new Date(currentYear, month, parseInt(day),
                            parseInt(hours), parseInt(minutes));
                    }
                }
            }
        }

        // If still invalid, return null
        if (!eventDate || isNaN(eventDate.getTime())) {
            return null;
        }

        const formatDate = (date: Date) => {
            return date.toISOString()
                .replace(/[-:]/g, '')
                .split('.')[0] + 'Z';
        };

        // Remove the default noon setting - we'll use the actual time from the date string
        // If no time was specified in the date string, the hours and minutes will already be 0

        return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDate(eventDate)}
DTEND:${formatDate(new Date(eventDate.getTime() + event.eventInfo.durationHours * 60 * 60 * 1000))} 
SUMMARY:${event.eventInfo.title}
LOCATION:${event.location}
DESCRIPTION:${event.description.intro}
END:VEVENT
END:VCALENDAR`;
    } catch (error) {
        return null;
    }
}

export default function InviteForm({ invite: initialInvite, event }: { invite: Invite, event: EventDetails }) {

    let [invite, setInvite] = useState(initialInvite)
    let [newPlusOne, setNewPlusOne] = useState(initialInvite.plusOne)
    let [loading, setLoading] = useState(false)

    const { toast } = useToast()

    const copyText = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "📋 Copied to Clipboard",
        })
    }

    const updateInvite = async (newInvite: Invite) => {
        setLoading(true);
        setNewPlusOne(newInvite.plusOne)
        try {
            const response = await fetch(`/api/invite/${invite.token}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers as needed (e.g., authentication headers)
                },
                body: JSON.stringify(newInvite),
            });

            if (!response.ok) {
                let message = (await response.json()).errorMessage
                if (message) {
                    throw new Error(message)
                }

                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setInvite(await response.json());

            if (newInvite.accepted == AcceptState.Accepted && newInvite.plusOne != invite.plusOne) {
                toast({
                    title: "✅ Updated Plus One",
                })
            }
        } catch (error) {
            //Handle any errors that occurred during the fetch
            setNewPlusOne(invite.plusOne)
            console.error('Fetch error:', error);
            toast({
                title: "Something went wrong!",
                description: `${error}`,
            })
        }

        setLoading(false);
    };

    const downloadCalendarFile = () => {
        const icsContent = generateICSContent(event);
        if (!icsContent) return;

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'invite.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <main className="pt-24 pb-10 px-10 lg:px-12 max-w-2xl mx-auto">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-6">
                Hi {invite.name}!
            </h1>

            <div className="pb-4 text-slate-500">
                <p className="pb-2">
                    {event.description.intro}
                </p>
                {event.description.paragraphs.map((paragraph, index) => (
                    <p key={index} className="pb-2">
                        {paragraph}
                    </p>
                ))}
            </div>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>{event.hardFacts.title}</CardTitle>
                    <CardDescription>{event.hardFacts.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                    {event.hardFacts.sections.map((section, index) => (
                        <div key={index} className="pb-3">
                            <h3 className="font-bold">{section.title}</h3>
                            {section.content
                                .replace('$date', event.date)
                                .replace('$location', event.location)}
                        </div>
                    ))}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => copyText(`${event.hardFacts.title}\n${event.hardFacts.sections.map(s =>
                                `${s.title}: ${s.content
                                    .replace('$date', event.date)
                                    .replace('$location', event.location)}`
                            ).join('\n')}`)}
                        >
                            Copy to Clipboard
                        </Button>
                        {generateICSContent(event) && (
                            <Button
                                variant="outline"
                                onClick={downloadCalendarFile}
                            >
                                Add to Calendar 📅
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {invite.accepted == AcceptState.Pending ? (
                <div className="text-right">
                    <Button disabled={loading} className="w-full mb-4" onClick={() => updateInvite({ ...invite, accepted: AcceptState.Accepted, plusOne: 0 })} >Ich bin dabei! 🎂 🎉</Button>
                    <Button disabled={loading} className="w-full" variant="secondary" onClick={() => updateInvite({ ...invite, accepted: AcceptState.Declined, plusOne: 0 })} >Ich kann leider nicht 😔</Button>
                </div>
            ) : invite.accepted == AcceptState.Accepted ? (
                <div className="pt-5 pb-2 relative">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Du bist dabei 🎉</h3>
                    <div className="pb-2">
                        Das ist super! Hier sind die Chat-Gruppen: <br />
                        <a className="text-blue-500 hover:underline" href={event.groupChat}>WhatsApp</a> · <a className="text-blue-500 hover:underline" href={event.groupChatTelegram}>Telegram</a>
                    </div>
                    <div className="pb-4">
                        Planst du jemanden mitzubringen und wenn ja, wie viele?
                    </div>

                    <div className="flex space-x-4">
                        <Input type="number" placeholder="" className="max-w-64" value={newPlusOne} onChange={(e) => setNewPlusOne(e.target.valueAsNumber)} />
                        <Button disabled={Number.isNaN(newPlusOne) || loading || newPlusOne == invite.plusOne} onClick={() => updateInvite({ ...invite, plusOne: newPlusOne })}>Update</Button>
                    </div>

                    <div className="h-full pt-8 space-y-4">
                        <div>
                            <Button
                                variant="outline"
                                onClick={() => updateInvite({ ...invite, accepted: AcceptState.Declined, plusOne: 0 })}
                            >
                                Abmelden 👋
                            </Button>
                        </div>
                        <div>
                            <Button className="h-2 pl-0 text-left" variant="link" onClick={() => updateInvite({ ...invite, accepted: AcceptState.Pending, plusOne: 0 })}>Alle meine Entscheidungen zurücksetzen</Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="pt-5 pb-2">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Du kommst nicht 😔</h3>
                    Schade, manche Leute wissen einfach nicht, wie man Spaß hat.

                    <div className="h-full pt-3">
                        <Button className="pl-0" variant="link" onClick={() => updateInvite({ ...invite, accepted: AcceptState.Pending, plusOne: 0 })}>Was? Nein! Ich bin lustig!</Button>
                    </div>
                </div>
            )
            }
        </main >
    );
}