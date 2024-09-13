import React, { useState } from 'react';
import CameraComponent from '../components/CameraComponent';
import AudioRecorder from '../components/AudioRecorder';

const Index = () => {
  const [photo, setPhoto] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">移动设备多媒体应用</h1>
      
      <div className="space-y-4 w-full max-w-md">
        <CameraComponent setPhoto={setPhoto} />
        {photo && (
          <img 
            src={photo} 
            alt="拍摄的照片" 
            className="w-full h-64 object-cover rounded-lg"
          />
        )}
        <AudioRecorder />
      </div>
    </div>
  );
};

export default Index;