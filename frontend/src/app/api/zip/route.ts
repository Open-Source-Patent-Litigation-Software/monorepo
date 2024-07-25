import { NextRequest, NextResponse } from 'next/server';
import { backendUrl } from '@/types/types';
import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async function POST(request: NextRequest) {
    const { patent_ids } = await request.json();

    if (!patent_ids || !Array.isArray(patent_ids)) {
        return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const zipURL = new URL(`${backendUrl}/patents/zipPatents`);
    const data = {
        "pns": patent_ids,
        "user": "user"
    };

    try {
        const response = await fetch(zipURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.log(response);
            return NextResponse.json({ message: 'Error fetching PDF links' }, { status: response.status });
        }

        const { zip_file, additional_data } = await response.json();
        if (zip_file === "") {
            console.log("none found");
            return NextResponse.json({ message: 'No valid patents found', not_found: additional_data.not_found }, { status: 200 });
        }

        const buffer = Buffer.from(zip_file, 'base64');

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename=patents.zip',
                'Additional-Data': JSON.stringify(additional_data),
            },
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal server error', error: error }, { status: 500 });
    }
});
