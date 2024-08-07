import { NextRequest } from 'next/server';
import { backendUrl } from '@/types/types';
import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';

export const GET = withApiAuthRequired(async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const patentIds = JSON.parse(decodeURIComponent(searchParams.get('patent_ids') || '[]'));

        const { accessToken } = await getAccessToken({
            scopes: ['user']
        });

        const bulkSummariesURL = new URL(`${backendUrl}/llm/getBulkSummaries`);
        const response = await fetch(bulkSummariesURL.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ patent_ids: patentIds }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Return the JSON data
        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error }), { status: 500 });
    }
});