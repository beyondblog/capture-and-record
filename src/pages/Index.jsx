import React, { useState, useRef } from 'react';
import { Camera, Mic } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const [photo, setPhoto] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const toggleCamera = async () => {
    if (isCapturing) {
      // Stop capturing
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsCapturing(false);
      toast.success("摄像头已关闭");
    } else {
      // Start capturing
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.play();
        setIsCapturing(true);
        setPhoto(null);
        toast.success("摄像头已开启");
      } catch (err) {
        toast.error("无法访问摄像头");
      }
    }
  };

  const takePhoto = () => {
    if (isCapturing) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const photoDataUrl = canvas.toDataURL('image/jpeg');
      setPhoto(photoDataUrl);
      toggleCamera(); // Stop capturing after taking photo
      toast.success("照片已拍摄");
    } else {
      toggleCamera(); // Start capturing if not already
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("录音已停止");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast.success("录音已开始");

        mediaRecorderRef.current.ondataavailable = (event) => {
          const audioUrl = URL.createObjectURL(event.data);
          const audio = new Audio(audioUrl);
          audio.play();
        };
      } catch (err) {
        toast.error("无法访问麦克风");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">移动设备多媒体应用</h1>
      
      <div className="space-y-4 w-full max-w-md">
        <Button 
          className="w-full" 
          onClick={takePhoto}
        >
          <Camera className="mr-2 h-4 w-4" />
          {isCapturing ? "拍照" : (photo ? "重新拍照" : "开始拍照")}
        </Button>

        {isCapturing && (
          <video 
            ref={videoRef} 
            className="w-full h-64 bg-black object-cover rounded-lg"
            playsInline
          />
        )}

        {photo && !isCapturing && (
          <img 
            src={photo} 
            alt="拍摄的照片" 
            className="w-full h-64 object-cover rounded-lg"
          />
        )}

        <Button 
          className={`w-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`} 
          onClick={toggleRecording}
        >
          <Mic className="mr-2 h-4 w-4" />
          {isRecording ? "停止录音" : "开始录音"}
        </Button>
      </div>
    </div>
  );
};

export default Index;