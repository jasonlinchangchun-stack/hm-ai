import React, { useState, useRef } from 'react';

interface AudioRecorderProps {
  onTranscript: (transcript: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscript }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        // 这里应该调用语音识别API
        // 暂时使用占位文本
        onTranscript('[语音转文字功能待实现]');
        
        // 停止所有音频轨道
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('无法访问麦克风:', error);
      alert('无法访问麦克风，请检查权限设置');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`px-4 py-2 rounded-md transition-colors ${
        isRecording
          ? 'bg-red-600 hover:bg-red-700 text-white'
          : 'bg-gray-600 hover:bg-gray-700 text-white'
      }`}
      type="button"
    >
      {isRecording ? '⏹ 停止' : '🎤 录音'}
    </button>
  );
};

export default AudioRecorder;