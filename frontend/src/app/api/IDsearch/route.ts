import { NextRequest, NextResponse } from 'next/server';
import { backendUrl } from '@/types/types';
import { withApiAuthRequired, getSession, getAccessToken } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { accessToken } = await getAccessToken({
            scopes: ['user']
        });

        const IDSearchURL = new URL(`${backendUrl}/patents/getPatentsByIDs`);

        const response = await fetch(IDSearchURL.toString(), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });


        if (!response.ok) {
            throw new Error(`HTTP error! :( status: ${response.status}`);
        }

        const patentData = await response.json();

        return NextResponse.json(patentData);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
});
