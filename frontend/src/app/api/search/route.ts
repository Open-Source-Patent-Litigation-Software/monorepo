import { NextRequest, NextResponse } from 'next/server';
import { backendUrl } from '@/types/types';
import { fetchAuthToken } from '@/utils/fetchAuthToken';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { metricsString } = body;

        if (!metricsString) {
            console.log('metricsString is missing');
            return NextResponse.json({ error: 'metrics are required' }, { status: 400 });
        }

        // Get the access token
        const accessToken = await fetchAuthToken();

        const searchURL = new URL(`${backendUrl}/patents/makeQuery`);
        searchURL.searchParams.append("search", metricsString.join("\n"));

        const searchResponse = await fetch(searchURL.toString(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!searchResponse.ok) {
            console.log(searchResponse);
            throw new Error(`HTTP error! :( status: ${searchResponse.status}`);
        }

        const searchData = await searchResponse.json();
        console.log(searchData);

        return NextResponse.json(searchData);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
