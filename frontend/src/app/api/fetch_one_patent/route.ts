// app/api/fetchOnePatent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { backendUrl } from '@/types/types';
import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("API BODY: ", body);
        if (!body) {
            return NextResponse.json({ error: 'patentQuery is required' }, { status: 400 });
        }

        // Get the access token
        const { accessToken } = await getAccessToken({
            scopes: ['user']
        });

        const endpoint = new URL(`${backendUrl}/save/fetch_one_patent`);
        const response = await fetch(endpoint.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! :( status: ${response.status}`);
        }

        const responseData = await response.json();

        return NextResponse.json(responseData);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
});
