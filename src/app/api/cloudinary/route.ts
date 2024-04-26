// import { NextRequest } from 'next/server';
// import { createHashFromString, sanitizeResource } from '@/utils/cloudinary';

// // This function is adapted from the upload functionality demonstrated in Colby Fayock's project.
// // The original code can be found at: https://github.com/colbyfayock/tweezer/blob/main/src/pages/api/upload.js

// // export const runtime = 'edge';

// export async function POST(req: NextRequest) {
//   const data = await req.formData();
//   const file = data.get('file');
//   const timestamp = Date.now();

//   const formData = new FormData();

//   const parameters: { [key: string]: string } = {
//     folder: process.env.CLOUDINARY_UPLOADS_FOLDER || ''
//   };

//   Object.keys(parameters)
//     .sort()
//     .forEach((key) => {
//       formData.append(key, parameters[key]);
//     });

//   if (file) {
//     formData.append('file', file);
//   }
//   const paramsString = Object.keys(parameters)
//     .map((key) => `${key}=${parameters[key]}`)
//     .join('&');

//   const paramsHash = await createHashFromString(
//     `${paramsString}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
//   );

//   if (process.env.CLOUDINARY_API_KEY) {
//     formData.append('api_key', process.env.CLOUDINARY_API_KEY);
//   }
//   formData.append('timestamp', timestamp.toString());
//   formData.append('signature', paramsHash);

//   try {
//     const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
//       method: 'POST',
//       body: formData
//     }).then((r) => r.json());

//     if (response.error) {
//       throw new Error(response.error?.message);
//     }

//     console.log('response', response);
//     return new Response(JSON.stringify(sanitizeResource(response)), {
//       headers: { 'Content-Type': 'application/json' },
//       status: 200
//     });
//   } catch (error: any) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       headers: { 'Content-Type': 'application/json' },
//       status: 500
//     });
//   }
// }

import { v2 as cloudinary } from 'cloudinary';
import { NextResponse, NextRequest } from 'next/server';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const POST = async (req: NextRequest) => {
  const data = await req.formData();
  const image = (await data.get('file')) as File;
  const fileBuffer = await image.arrayBuffer();

  var mime = image.type;
  var encoding = 'base64';
  var base64Data = Buffer.from(fileBuffer).toString('base64');
  var fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

  try {
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        var result = cloudinary.uploader
          .upload(fileUri, {
            invalidate: true,
            folder: 'uploads'
          })
          .then((result) => {
            console.log(result);
            resolve(result);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    };

    const result = await uploadToCloudinary();

    let imageUrl: string = (result as { secure_url: string }).secure_url;

    return NextResponse.json({ success: true, imageUrl: imageUrl }, { status: 200 });
  } catch (error) {
    console.log('server err', error);
    return NextResponse.json({ err: 'Internal Server Error' }, { status: 500 });
  }
};
