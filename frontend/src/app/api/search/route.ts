import { NextRequest, NextResponse } from 'next/server';
import { backendUrl } from '@/types/types';
import { fetchAuthToken } from '@/utils/fetchAuthToken';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { metricsString } = body;

        if (!metricsString) {
            return NextResponse.json({ error: 'metrics are required' }, { status: 400 });
        }

        // Get the access token
        const accessToken = await fetchAuthToken();

        const formattedSearch = {
            metrics: metricsString,
            user: "user",
        };

        const searchURL = new URL(`${backendUrl}/patents/makeQuery`);

        const searchResponse = await fetch(searchURL.toString(), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(formattedSearch),
        });

        if (!searchResponse.ok) {
            throw new Error(`HTTP error! :( status: ${searchResponse.status}`);
        }

        const searchData = await searchResponse.json();

        return NextResponse.json(searchData);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
