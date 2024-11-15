import { v2 as cloudinary } from 'cloudinary';
import { NextResponse, NextRequest } from 'next/server';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const POST = async (req: NextRequest) => {
  const data = await req.formData();
  const image = data.get('file') as File;
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
            folder: process.env.CLOUDINARY_UPLOADS_FOLDER || 'uploads',
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
