import { NextRequest, NextResponse } from 'next/server';
import { backendUrl } from '@/types/types';
import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async function POST(request: NextRequest) {
    const body = await request.json();

    const queries: string[] = body.queries;
    const user = body.user;

    console.log("Request body:", body);
    console.log("Queries:", queries);

    const { accessToken } = await getAccessToken({
        scopes: ['user']
    });

    const IDSearchURL = new URL(`${backendUrl}/patents/getPatentsByIDs`);

    try {

        const responses = await Promise.all(
            queries.map(async (query: string) => {
                const response = await fetch(IDSearchURL.toString(), {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        pn: query,
                        user: user,
                    }),
                });

                if (!response.ok) {
                    console.error(`Failed to fetch for query ${query}:`, response.status, response.statusText);
                    throw new Error(`Network response was not ok for ${response.url}`);
                }
                return response.json();
            })
        );

        console.log("Responses:", responses);

        return NextResponse.json(responses);
    } catch (error) {
        console.error("An error occurred:", error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
});
