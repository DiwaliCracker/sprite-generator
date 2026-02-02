import { AwsClient } from 'aws4fetch';

export async function onRequestPost(context) {
  const { fileName } = await context.request.json();
  const env = context.env;

  const r2 = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    service: 's3',
  });

  // Create a secure URL that is valid for 5 minutes
  const url = await r2.sign(
    new Request(`https://${env.ACCOUNT_ID}.r2.cloudflarestorage.com/${env.BUCKET_NAME}/${fileName}`, {
      method: 'PUT',
    }),
    { aws: { signQuery: true } }
  );

  return new Response(JSON.stringify({ url: url.url }));
}
