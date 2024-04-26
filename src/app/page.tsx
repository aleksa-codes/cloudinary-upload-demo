import Upload from '@/components/Upload';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2 gap-32'>
      <h1 className='text-6xl font-bold'>Upload Image</h1>
      <Upload />
    </div>
  );
}
