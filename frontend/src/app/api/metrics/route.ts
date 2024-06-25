import { NextRequest, NextResponse } from 'next/server';
import { backendUrl } from '@/types/types';
import { fetchAuthToken } from '@/utils/fetchAuthToken';

export async function POST(request: NextRequest) {
  console.log('API route /api/metrics called'); // Log that the route was called

  try {
    const body = await request.json();
    const { patentQuery } = body;

    console.log('Received patentQuery:', patentQuery);

    if (!patentQuery) {
      console.log('patentQuery is missing');
      return NextResponse.json({ error: 'patentQuery is required' }, { status: 400 });
    }

    // Get the access token
    const accessToken = await fetchAuthToken();

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
    return NextResponse.json({ error: error }, { status: 500 });
  }
}