import { LucideIcon } from 'lucide-react';

export type AgentId = 'resource' | 'mentor' | 'assessment' | 'advocacy';

export interface Agent {
  id: AgentId;
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
  systemPrompt: string;
  welcomeMessage: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
  groundingSources?: GroundingSource[];
  isJsonAssessment?: boolean;
}

export interface AssessmentQuestion {
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
}
