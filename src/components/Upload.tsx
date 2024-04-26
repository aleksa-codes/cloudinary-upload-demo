'use client';

import React, { useState } from 'react';

const Upload = ({ endpoint }: { endpoint: string }) => {
  const [image, setImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData // Send formData instead of JSON
        });
        if (response.ok) {
          const data = await response.json();
          setIsUploading(false);
          setImage(data.imageUrl);
          e.target.value = '';
        } else {
          const error = await response.json();
          console.error('Error uploading image:', error);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      console.error('Error uploading image: No file selected.');
    }
  };

  return (
    <div>
      <input type='file' onChange={handleImageUpload} />
      {isUploading && <p>Uploading image...</p>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {image && <img src={image} alt='Uploaded' className='w-64 h-64 object-contain mt-4' />}
    </div>
  );
};

export default Upload;
