// app/api/citations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { backendUrl } from '@/types/types';
import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body) {
            return NextResponse.json({ error: 'patentQuery is required' }, { status: 400 });
        }

        // Get the access token
        const { accessToken } = await getAccessToken({
            scopes: ['user']
        });

        const citationsURL = new URL(`${backendUrl}/nlp/getCitations`);
        const citationsResponse = await fetch(citationsURL.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });


        console.log(citationsResponse);
        
        if (!citationsResponse.ok) {
            console.log("failed here");
            throw new Error(`HTTP error! :( status: ${citationsResponse.status}`);
        }

        const citationsData = await citationsResponse.json();

        return NextResponse.json(citationsData);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
});
