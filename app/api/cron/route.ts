import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const newsApiKey = process.env.NEWSAPI_KEY;
    if (!newsApiKey) {
      console.error('NEWSAPI_KEY is not set');
      return new Response('Missing NEWSAPI_KEY', { status: 500 });
    }

    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=in&apiKey=${newsApiKey}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data = await response.json();

    console.log(`✅ Cron job completed - Fetched ${data.articles?.length || 0} news articles`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Fetched ${data.articles?.length || 0} articles`,
        count: data.articles?.length || 0,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Cron job failed:', error);
    return new Response('Cron job failed', { status: 500 });
  }
}