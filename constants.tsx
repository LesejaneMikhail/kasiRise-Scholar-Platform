import { BookOpen, MessageSquare, Brain, Award } from 'lucide-react';
import { Agent } from './types';

export const AGENTS: Agent[] = [
  {
    id: 'resource',
    name: 'Resource Discovery',
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-600',
    description: 'Find IEB-aligned learning materials via Google Search',
    systemPrompt: '', // Handled dynamically in service for tools
    welcomeMessage: "Welcome! I'm here to help you find the best IEB mathematics learning materials. I can search the live web for Siyavula, Mindset Learn, and other South African resources. What topic are you studying?"
  },
  {
    id: 'mentor',
    name: 'Socratic Mentor',
    icon: MessageSquare,
    color: 'text-green-600',
    bgColor: 'bg-green-600',
    description: 'Master math concepts through guided discovery',
    systemPrompt: '',
    welcomeMessage: "Sawubona! I'm your mathematics mentor. I won't give you answers - instead, I'll guide you to discover them yourself using examples from our daily lives. What math concept are you working on today?"
  },
  {
    id: 'assessment',
    name: 'Aptitude Assessment',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-600',
    description: 'Measure fluid intelligence & potential',
    systemPrompt: '',
    welcomeMessage: "Welcome to the Aptitude Assessment. I will present pattern recognition and logic puzzles to test your learning potential, not your past schooling. Type 'Start' to begin your first puzzle."
  },
  {
    id: 'advocacy',
    name: 'Advocacy Assistant',
    icon: Award,
    color: 'text-amber-600',
    bgColor: 'bg-amber-600',
    description: 'Draft scholarship applications',
    systemPrompt: '',
    welcomeMessage: "Hello! I'll help you prepare a strong scholarship application. I can draft letters that highlight your potential. To start, tell me your name, grade, and the school you wish to apply to."
  }
];
