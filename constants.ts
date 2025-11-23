export const API_CONFIG = {
  DEEPSEEK_API_URL: 'https://api.deepseek.com/v1/chat/completions',
  MODEL: 'deepseek-chat',
};

export const INTERVIEW_PROMPTS = {
  SYSTEM: `你是一位专业的面试官助手，负责帮助候选人进行模拟面试。
你需要：
1. 根据候选人的简历和目标岗位提出相关问题
2. 评估候选人的回答质量
3. 提供建设性的反馈
4. 保持专业和友好的态度`,
  
  INITIAL: (position: string, company: string) => 
    `我正在准备${company}的${position}职位面试。请开始对我进行模拟面试。`,
};

export const UI_TEXTS = {
  SETUP_TITLE: '配置面试信息',
  CHAT_TITLE: '模拟面试进行中',
  REPORT_TITLE: '面试报告',
};