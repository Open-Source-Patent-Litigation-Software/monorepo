import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/types/types";
import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";

export const POST = withApiAuthRequired(async function POST(
    request: NextRequest
) {
    try {
        // Get the access token
        const { accessToken } = await getAccessToken({
            scopes: ["user"],
        });
        const searchURL = new URL(`${backendUrl}/save/fetch_patents`);
        const fetchPatentResponse = await fetch(searchURL.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!fetchPatentResponse.ok) {
            throw new Error(`HTTP error! :( status: ${fetchPatentResponse.status}`);
        }

        const response = await fetchPatentResponse.json();

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
});
