export interface InterviewConfig {
  apiKey: string;
  position: string;
  company: string;
  resumeText: string;
  jobDescription: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface InterviewReport {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
}