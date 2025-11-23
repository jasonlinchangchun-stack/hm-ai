import React, { useState } from 'react';
import { InterviewConfig } from '../types';

interface SetupFormProps {
  onComplete: (config: InterviewConfig) => void;
}

const SetupForm: React.FC<SetupFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState<InterviewConfig>({
    apiKey: '',
    position: '',
    company: '',
    resumeText: '',
    jobDescription: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const handleChange = (field: keyof InterviewConfig, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">配置面试信息</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DeepSeek API Key
          </label>
          <input
            type="password"
            value={formData.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            目标职位
          </label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => handleChange('position', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例如：高级前端工程师"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            目标公司
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例如：字节跳动"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            个人简历
          </label>
          <textarea
            value={formData.resumeText}
            onChange={(e) => handleChange('resumeText', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder="粘贴您的简历内容..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            职位描述（JD）
          </label>
          <textarea
            value={formData.jobDescription}
            onChange={(e) => handleChange('jobDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder="粘贴职位描述..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          开始面试
        </button>
      </form>
    </div>
  );
};

export default SetupForm;