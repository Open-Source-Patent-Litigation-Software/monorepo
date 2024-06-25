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

        const metricsURL = new URL(
            `${backendUrl}/llm/extractSpecificPatentMetrics`
        );
        const percentagesResponse = await fetch(metricsURL.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });


        if (!percentagesResponse.ok) {
        throw new Error(`HTTP error! :( status: ${percentagesResponse.status}`);
        }

        const percentagesData = await percentagesResponse.json();

        return NextResponse.json(percentagesData);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
