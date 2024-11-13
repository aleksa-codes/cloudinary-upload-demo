import Upload from '@/components/Upload';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2 gap-32 bg-black text-white'>
      <h1 className='text-6xl font-bold'>Upload Image</h1>
      {/* two upload components, one using the cloudinary npm package and the other using the cloudinary api */}
      <div className='flex gap-8'>
        <div>
          <h2 className='text-2xl font-bold'>Cloudinary NPM</h2>
          <Upload endpoint='/api/cloudinary-npm' />
        </div>
        <div>
          <h2 className='text-2xl font-bold'>Cloudinary API</h2>
          <Upload endpoint='/api/cloudinary-api' />
        </div>
      </div>
    </div>
  );
}
