import { API_CONFIG } from '../constants';
import { InterviewConfig, Message } from '../types';

export class AIService {
  private apiKey: string;
  private config: InterviewConfig;

  constructor(config: InterviewConfig) {
    this.apiKey = config.apiKey;
    this.config = config;
  }

  async sendMessage(messages: Message[]): Promise<string> {
    try {
      const response = await fetch(API_CONFIG.DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: API_CONFIG.MODEL,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  async generateReport(messages: Message[]): Promise<any> {
    const reportPrompt = `基于以下面试对话，生成一份详细的面试报告，包括：
1. 总体评分（0-100）
2. 优势（至少3点）
3. 需要改进的地方（至少3点）
4. 详细反馈

请以JSON格式返回。`;

    const reportMessages = [
      ...messages,
      { role: 'user' as const, content: reportPrompt, timestamp: new Date() },
    ];

    const response = await this.sendMessage(reportMessages);
    return JSON.parse(response);
  }
}