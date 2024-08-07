import { NextRequest, NextResponse } from 'next/server';
import { backendUrl } from '@/types/types';
import { withApiAuthRequired, getSession, getAccessToken } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patentQuery } = body;

    if (!patentQuery) {
      console.log("failing here");
      return NextResponse.json({ error: 'patentQuery is required' }, { status: 400 });
    }

    // Get the access token
    // const token = await getAccessToken();

    const { accessToken } = await getAccessToken({
      scopes: ['user']
    });

    const metricsURL = new URL(`${backendUrl}/llm/obtainMetrics`);

    const formattedSearch = {
      searchQuery: patentQuery,
      user: "user",
    };

    const metricsResponse = await fetch(metricsURL.toString(), {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formattedSearch),
    });


    if (!metricsResponse.ok) {
      throw new Error(`HTTP error! :( status: ${metricsResponse.status}`);
    }

    const metricsData = await metricsResponse.json();

    return NextResponse.json(metricsData);
  } catch (error) {
    console.log("failed here");
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
});
