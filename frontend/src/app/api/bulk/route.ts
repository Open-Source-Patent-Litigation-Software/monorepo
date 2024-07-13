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
        
        console.log("body: ", body); // Works
        const bulkSummariesURL = new URL(`${backendUrl}/llm/getBulkSummaries`);
        const bulkSummaryResponse = await fetch(bulkSummariesURL.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });


        // console.log(citationsResponse);
        
        // if (!citationsResponse.ok) {
        //     console.log("failed here");
        //     throw new Error(`HTTP error! :( status: ${citationsResponse.status}`);
        // }

        return NextResponse.json({ message: "Successfully generated summary document"});
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
});
