import React, { useState } from 'react';
import { GraduationCap, Users, ChevronRight, Sparkles } from 'lucide-react';
import { AGENTS } from './constants';
import { Agent } from './types';
import { ChatInterface } from './components/ChatInterface';

const App = () => {
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);

  if (activeAgent) {
    return (
      <div className="min-h-screen bg-gray-50 pt-6 px-4 pb-4">
        <ChatInterface 
          agent={activeAgent} 
          onBack={() => setActiveAgent(null)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white pb-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-6 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
              <GraduationCap className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">KasiRise Scholar</h1>
              <p className="text-slate-400 text-sm">Empowering Township Talent</p>
            </div>
          </div>

          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Opening pathways to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">elite education</span>
            </h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
              Using advanced AI to identify potential, bridge the math gap, and secure scholarships for learners who deserve a chance to shine.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-20">
        
        {/* Mission Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-orange-50 p-4 rounded-full flex-shrink-0">
                <Users className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Our Revolution</h3>
                <p className="text-gray-600 leading-relaxed">
                    We transform townships from dormitory communities into springboards for success. 
                    The KasiRise platform bridges the gap between local curriculum and IEB standards.
                </p>
            </div>
        </div>

        {/* Agents Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            Select Your Agent
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {AGENTS.map((agent) => {
              const Icon = agent.icon;
              return (
                <button
                  key={agent.id}
                  onClick={() => setActiveAgent(agent)}
                  className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 text-left overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 ${agent.bgColor} opacity-5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150`}></div>
                  
                  <div className="flex items-start gap-5 relative z-10">
                    <div className={`${agent.bgColor} p-4 rounded-xl shadow-lg shadow-${agent.color}/20 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {agent.name}
                      </h4>
                      <p className="text-gray-500 mb-4 text-sm leading-relaxed">{agent.description}</p>
                      <div className="flex items-center text-sm font-semibold text-slate-900 group-hover:gap-2 transition-all">
                        Start Session <ChevronRight className="w-4 h-4 ml-1 text-orange-500" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
            <h4 className="font-bold text-gray-900 mb-6 text-center">The KasiRise 4-Step Workflow</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                    { step: 1, title: "Discovery", desc: "Curate IEB Materials" },
                    { step: 2, title: "Mentorship", desc: "Socratic Method" },
                    { step: 3, title: "Assessment", desc: "Fluid Intelligence" },
                    { step: 4, title: "Advocacy", desc: "Human-in-the-Loop" }
                ].map((item) => (
                    <div key={item.step} className="p-4 bg-white rounded-xl shadow-sm">
                        <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-sm">
                            {item.step}
                        </div>
                        <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
