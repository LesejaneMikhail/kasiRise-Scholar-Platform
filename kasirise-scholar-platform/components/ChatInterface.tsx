import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ExternalLink, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { Agent, Message, AssessmentQuestion } from '../types';
import { sendMessageToAgent } from '../services/geminiService';

interface ChatInterfaceProps {
  agent: Agent;
  onBack: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ agent, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: agent.welcomeMessage }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsgText = input;
    const userMessage: Message = { role: 'user', content: userMsgText };
    
    setInput('');
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    // Pass history excluding the very last user message we just added (to avoid duplication if logic changes)
    // but the service function expects the new message as a separate arg.
    const response = await sendMessageToAgent(agent.id, messages, userMsgText);
    
    setMessages(prev => [...prev, response]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper to render assessment JSON content nicely
  const renderContent = (msg: Message) => {
    if (msg.isJsonAssessment) {
      try {
        const data: AssessmentQuestion = JSON.parse(msg.content);
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-purple-900">{data.question}</h4>
            <div className="grid gap-2">
              {data.options?.map((opt, idx) => (
                <button key={idx} className="text-left px-4 py-3 bg-white border-2 border-purple-100 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                  <span className="font-bold mr-2 text-purple-600">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              ))}
            </div>
            {/* Hidden logic/explanation for demo purposes could be shown here if needed */}
          </div>
        );
      } catch (e) {
        return <p>{msg.content}</p>;
      }
    }
    
    // Standard text rendering with line breaks
    return (
      <div className="whitespace-pre-wrap leading-relaxed">
        {msg.content}
        {agent.id === 'advocacy' && msg.role === 'assistant' && (
           <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2 text-sm text-amber-800">
             <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
             <p><strong>Human-in-the-Loop:</strong> This draft requires review by a mentor before submission.</p>
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] max-w-5xl mx-auto w-full bg-white md:rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Chat Header */}
      <div className={`${agent.bgColor} px-6 py-4 flex items-center justify-between border-b border-gray-100`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <agent.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{agent.name}</h2>
              <p className="text-sm text-white/90 opacity-90">{agent.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-6 py-4 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-gray-100 rounded-bl-none'
              }`}
            >
              {renderContent(msg)}
              
              {/* Grounding Sources (Specific to Agent 1) */}
              {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Verified Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingSources.map((source, i) => (
                      <a 
                        key={i}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors border border-blue-100"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-none px-6 py-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
              <span className="text-sm text-gray-500 font-medium">Processing via Gemini...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={agent.id === 'assessment' ? "Type 'Ready' to begin the next puzzle..." : "Type your message..."}
            className="flex-1 px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-gray-700 placeholder-gray-400"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 p-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all transform active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">
          Powered by Google Gemini 2.5 • KasiRise Scholar Platform
        </p>
      </div>
    </div>
  );
};
