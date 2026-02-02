export async function onRequest(context) {
  const url = new URL(context.request.url);
  const videoUrl = url.searchParams.get('url');

  if (!videoUrl) return new Response('Missing URL', { status: 400 });

  // Fetch the video
  const response = await fetch(videoUrl, {
    headers: {
      'User-Agent': 'Cloudflare-Worker'
    }
  });

  // Send it back to your browser with "permissions" allowed
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*');

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders
  });
}
