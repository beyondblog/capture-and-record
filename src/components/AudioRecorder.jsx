import React, { useState, useRef } from 'react';
import { Mic } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

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
        if (err.name === 'NotAllowedError') {
          toast.error("麦克风权限被拒绝。请在浏览器设置中允许访问麦克风。");
        } else {
          toast.error(`无法访问麦克风: ${err.message}`);
        }
        console.error('Microphone access error:', err);
      }
    }
  };

  return (
    <Button 
      className={`w-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`} 
      onClick={toggleRecording}
    >
      <Mic className="mr-2 h-4 w-4" />
      {isRecording ? "停止录音" : "开始录音"}
    </Button>
  );
};

export default AudioRecorder;