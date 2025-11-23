import React, { useState, useEffect, useRef } from 'react';
import { InterviewConfig, Message } from '../types';
import { AIService } from '../services/aiService';
import AudioRecorder from './AudioRecorder';
import { INTERVIEW_PROMPTS } from '../constants';

interface ChatInterfaceProps {
  config: InterviewConfig;
  onComplete: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ config, onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiService = useRef(new AIService(config));

  useEffect(() => {
    // 初始化对话
    const initMessage: Message = {
      role: 'assistant',
      content: `您好！我是您的面试助教。今天我们将进行${config.company}的${config.position}职位的模拟面试。准备好了吗？让我们开始吧！`,
      timestamp: new Date(),
    };
    setMessages([initMessage]);
  }, [config]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.current.sendMessage([...messages, userMessage]);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      alert('发送消息失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioTranscript = (transcript: string) => {
    setInput(transcript);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">模拟面试进行中</h2>
        <button
          onClick={onComplete}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          结束面试
        </button>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              正在思考...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入您的回答..."
            disabled={isLoading}
          />
          <AudioRecorder onTranscript={handleAudioTranscript} />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;