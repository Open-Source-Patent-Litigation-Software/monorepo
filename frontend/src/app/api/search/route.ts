import { NextRequest, NextResponse } from 'next/server';
import { backendUrl } from '@/types/types';
import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async function POST(request: NextRequest) {    
    try {
        const body = await request.json();

        if (!body) {
            return NextResponse.json({ error: 'body required' }, { status: 400 });
        }

        // Get the access token
        const { accessToken } = await getAccessToken({
            scopes: ['user']
        });

        const searchURL = new URL(`${backendUrl}/nlp/searchPatents`);

        const searchResponse = await fetch(searchURL.toString(), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });

        if (!searchResponse.ok) {
            throw new Error(`HTTP error! :( status: ${searchResponse.status}`);
        }

        const DynamoIdList = await searchResponse.json();
        return NextResponse.json(DynamoIdList);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
});
