export async function onRequest(context) {
  const url = new URL(context.request.url);
  const videoUrl = url.searchParams.get('url');

  if (!videoUrl) return new Response('Missing URL', { status: 400 });

  // Get the 'Range' header from the browser request (FFmpeg sends this)
  const range = context.request.headers.get('Range');

  const response = await fetch(videoUrl, {
    headers: {
      'User-Agent': 'Cloudflare-Worker',
      ...(range && { 'Range': range }) // Pass the range request to the video host
    }
  });

  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*');
  newHeaders.set('Access-Control-Allow-Headers', 'Range');
  newHeaders.set('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders
  });
}
