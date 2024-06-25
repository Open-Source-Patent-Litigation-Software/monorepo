import { NextRequest, NextResponse } from 'next/server';
import { backendUrl } from '@/types/types';
import { fetchAuthToken } from '@/utils/fetchAuthToken';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body) {
            return NextResponse.json({ error: 'patentQuery is required' }, { status: 400 });
        }

        // Get the access token
        const accessToken = await fetchAuthToken();

        const citaionsURL = new URL(`${backendUrl}/llm/getCitation`);
        const citationsResponse = await fetch(citaionsURL.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });


        if (!citationsResponse.ok) {
        throw new Error(`HTTP error! :( status: ${citationsResponse.status}`);
        }

        const citationsData = await citationsResponse.json();

        return NextResponse.json(citationsData);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
