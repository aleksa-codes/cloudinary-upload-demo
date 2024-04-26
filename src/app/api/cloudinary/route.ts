import { NextRequest } from 'next/server';
import { createHashFromString, sanitizeResource } from '@/utils/cloudinary';

// This function is adapted from the upload functionality demonstrated in Colby Fayock's project.
// The original code can be found at: https://github.com/colbyfayock/tweezer/blob/main/src/pages/api/upload.js

// export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get('file');
  const timestamp = Date.now();

  const formData = new FormData();

  const parameters: { [key: string]: string } = {
    folder: process.env.CLOUDINARY_UPLOADS_FOLDER || ''
  };

  Object.keys(parameters)
    .sort()
    .forEach((key) => {
      formData.append(key, parameters[key]);
    });

  if (file) {
    formData.append('file', file);
  }
  const paramsString = Object.keys(parameters)
    .map((key) => `${key}=${parameters[key]}`)
    .join('&');

  const paramsHash = await createHashFromString(
    `${paramsString}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
  );

  if (process.env.CLOUDINARY_API_KEY) {
    formData.append('api_key', process.env.CLOUDINARY_API_KEY);
  }
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', paramsHash);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    }).then((r) => r.json());

    if (response.error) {
      throw new Error(response.error?.message);
    }

    console.log('response', response);
    return new Response(JSON.stringify(sanitizeResource(response)), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
