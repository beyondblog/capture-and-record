import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CameraComponent = ({ setPhoto }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => stopMediaStream();
  }, []);

  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      return true;
    } catch (err) {
      handleCameraError(err);
      return false;
    }
  };

  const handleCameraError = (err) => {
    if (err.name === 'NotAllowedError') {
      toast.error("摄像头权限被拒绝。请在浏览器设置中允许访问摄像头。");
    } else if (err.name === 'NotFoundError') {
      toast.error("未检测到摄像头设备。请确保设备已连接。");
    } else {
      toast.error(`无法访问摄像头: ${err.message}`);
    }
    console.error('Camera error:', err);
  };

  const toggleCamera = async () => {
    if (isCapturing) {
      stopMediaStream();
      setIsCapturing(false);
      toast.success("摄像头已关闭");
    } else {
      const hasPermission = await requestCameraPermission();
      if (hasPermission) {
        try {
          if (videoRef.current) {
            videoRef.current.srcObject = streamRef.current;
            await videoRef.current.play();
            setIsCapturing(true);
            setPhoto(null);
            toast.success("摄像头已开启");
          } else {
            throw new Error('Video element not found');
          }
        } catch (err) {
          console.error('Camera start error:', err);
          toast.error(`启动摄像头失败: ${err.message}`);
        }
      }
    }
  };

  const takePhoto = () => {
    if (isCapturing && videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const photoDataUrl = canvas.toDataURL('image/jpeg');
      setPhoto(photoDataUrl);
      stopMediaStream();
      setIsCapturing(false);
      toast.success("照片已拍摄");
    } else {
      toggleCamera();
    }
  };

  const getButtonText = () => {
    if (!isCapturing) return "开始拍照";
    return "拍照";
  };

  return (
    <>
      <Button 
        className="w-full" 
        onClick={takePhoto}
      >
        <Camera className="mr-2 h-4 w-4" />
        {getButtonText()}
      </Button>

      {isCapturing && (
        <video 
          ref={videoRef} 
          className="w-full h-64 bg-black object-cover rounded-lg"
          playsInline
        />
      )}
    </>
  );
};

export default CameraComponent;