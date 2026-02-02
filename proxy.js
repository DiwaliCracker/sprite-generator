export async function onRequest(context) {
  const url = new URL(context.request.url);
  const videoUrl = url.searchParams.get('url');

  if (!videoUrl) return new Response('Missing URL', { status: 400 });

  // Fetch the video from the internet
  const response = await fetch(videoUrl, {
    headers: {
      'User-Agent': 'Cloudflare-Worker'
    }
  });

  // Relay it back to the browser
  return new Response(response.body, response);
}
