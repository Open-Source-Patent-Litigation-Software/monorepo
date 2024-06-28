import { NextRequest, NextResponse } from 'next/server';
import { backendUrl } from '@/types/types';
import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async function POST(request: NextRequest) {
    const body = await request.json();

    const { queries, user } = body;

    const { accessToken } = await getAccessToken({
        scopes: ['user']
    });

    const IDSearchURL = new URL(`${backendUrl}/patents/getPatentsByIDs`);

    try {
        const responses = await Promise.all(
            queries.map((query: string) => (
                fetch(IDSearchURL.toString(), {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        pn: query,
                        user: user,
                    }),
                })))
        );

        console.log(responses);

        const dataPromises = responses.map(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok for ${response.url}`);
            }
            return response.json();
        });

        const data = await Promise.all(dataPromises);

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
});
