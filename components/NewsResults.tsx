
import React from 'react';
import { 
  ExternalLink, ShieldAlert, Target, Play, RefreshCw, 
  AlertTriangle, Calendar, UserCheck, Globe, Zap, Clock, 
  ChevronRight, List, BrainCircuit, Activity
} from 'lucide-react';
import { NewsItem, GroundingSource } from '../types';

interface NewsResultsProps {
  items: NewsItem[];
  sources: GroundingSource[];
  analysisContext: string;
  profileFocusAreas: string[];
  strategicSummary: string;
  groundLevelSummary: string;
  onReset: () => void;
}

const NewsResults: React.FC<NewsResultsProps> = ({ 
  items, 
  sources, 
  analysisContext, 
  profileFocusAreas,
  strategicSummary, 
  groundLevelSummary, 
  onReset 
}) => {
  const strategicItems = items.filter(item => item.category === 'strategic');
  const groundLevelItems = items.filter(item => item.category === 'ground-level');

  const renderNewsItem = (item: NewsItem, index: number) => (
    <div key={item.id} className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300">
      <div className="p-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-xs">0{index + 1}</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
              ${item.priority === 'High' ? 'bg-rose-50 text-rose-700' : 
                item.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'}
            `}>
              {item.priority} Priority
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
            {item.source}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-700 transition-colors">
          {item.headline}
        </h3>
        
        <p className="text-slate-600 leading-relaxed mb-6 text-lg">
          {item.summary}
        </p>
        
        {item.scenario && (
          <div className="mb-6 p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Clock size={40} className="text-indigo-900" />
            </div>
            <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-xs uppercase tracking-widest">
              <Activity size={14} />
              Applied Persona Scenario
            </div>
            <p className="text-sm text-indigo-900 font-medium leading-relaxed italic">"{item.scenario}"</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm uppercase tracking-wider">
              <Target size={16} className="text-blue-600" />
              Intelligence Relevance
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.relevance}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm uppercase tracking-wider">
              <Play size={16} className="text-emerald-600" />
              Strategic Action: {item.action}
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.actionReason}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-32">
      {/* HEADER ACTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Report</h2>
          <p className="text-slate-500 font-medium">Synthesized for your specific profile and industry.</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-black transition-all bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md"
        >
          <RefreshCw size={16} />
          New Intelligence Cycle
        </button>
      </div>

      {/* 1. PROFILE ANALYSIS SUMMARY */}
      <section className="mb-12">
        <div className="bg-[#0F172A] rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-3xl rounded-full -mr-20 -mt-20"></div>
          
          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-xl shadow-blue-500/20">
              <BrainCircuit size={32} />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.3em]">System Analysis</span>
                <div className="h-px bg-slate-800 flex-grow"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Persona Intelligence Context</h3>
              <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-3xl">
                {analysisContext || "Synthesizing industry shifts and frontier model capabilities optimized for your professional standing."}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {profileFocusAreas.map((area, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-800/50 border border-slate-700 text-slate-100 text-xs font-bold rounded-lg uppercase tracking-wider">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE DASHBOARD (TOP 10 SUMMARY TABLE) */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-6">
          <List className="text-slate-400" size={20} />
          <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest">Executive Dashboard (Top 10 Signals)</h4>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strategic Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <Globe size={18} />
                <h5 className="font-bold text-sm tracking-tight">Strategic Intelligence</h5>
              </div>
              <span className="text-[10px] bg-blue-700 text-blue-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">View 01</span>
            </div>
            <div className="p-2 flex-grow">
              <div className="divide-y divide-slate-100">
                {strategicItems.map((item, i) => (
                  <div key={i} className="group p-4 flex gap-4 items-center hover:bg-slate-50 transition-colors cursor-default">
                    <span className="font-mono text-xs text-slate-300">0{i+1}</span>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate group-hover:text-blue-600 transition-colors">{item.headline}</p>
                      <p className="text-[11px] text-slate-500 font-medium truncate italic">{item.source}</p>
                    </div>
                    <span className={`shrink-0 w-2 h-2 rounded-full ${item.priority === 'High' ? 'bg-rose-500' : item.priority === 'Medium' ? 'bg-amber-400' : 'bg-sky-400'}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-500 italic font-medium">"{strategicSummary}"</p>
            </div>
          </div>

          {/* Execution Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <Zap size={18} />
                <h5 className="font-bold text-sm tracking-tight">Execution Sense</h5>
              </div>
              <span className="text-[10px] bg-emerald-700 text-emerald-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">View 02</span>
            </div>
            <div className="p-2 flex-grow">
              <div className="divide-y divide-slate-100">
                {groundLevelItems.map((item, i) => (
                  <div key={i} className="group p-4 flex gap-4 items-center hover:bg-slate-50 transition-colors cursor-default">
                    <span className="font-mono text-xs text-slate-300">0{i+1}</span>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate group-hover:text-emerald-600 transition-colors">{item.headline}</p>
                      <p className="text-[11px] text-slate-500 font-medium truncate italic">{item.source}</p>
                    </div>
                    <span className={`shrink-0 w-2 h-2 rounded-full ${item.priority === 'High' ? 'bg-rose-500' : item.priority === 'Medium' ? 'bg-amber-400' : 'bg-sky-400'}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-500 italic font-medium">"{groundLevelSummary}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DETAILED DEEP DIVES */}
      <div className="space-y-32">
        {/* STRATEGIC SECTION */}
        <section>
          <div className="flex items-end justify-between mb-12 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 flex items-center justify-center text-white rounded-2xl shadow-lg shadow-blue-500/20">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">01. Strategic Horizon</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Market shifts, Governance & Fundamental breakthroughs</p>
              </div>
            </div>
            <div className="hidden md:flex gap-1 text-[10px] font-bold text-slate-400 items-center">
              SCROLL TO EXPLORE <ChevronRight size={10} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-12">
            {strategicItems.map((item, idx) => renderNewsItem(item, idx))}
          </div>
        </section>

        {/* GROUND-LEVEL SECTION */}
        <section>
          <div className="flex items-end justify-between mb-12 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 flex items-center justify-center text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">02. Execution Sense</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Tools, Workflow integrations & Practical scenarios</p>
              </div>
            </div>
            <div className="hidden md:flex gap-1 text-[10px] font-bold text-slate-400 items-center">
              SCROLL TO EXPLORE <ChevronRight size={10} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-12">
            {groundLevelItems.map((item, idx) => renderNewsItem(item, idx))}
          </div>
        </section>
      </div>

      {/* FOOTER: SOURCES */}
      {sources.length > 0 && (
        <div className="mt-24 pt-12 border-t border-slate-200">
          <div className="flex items-center gap-4 mb-8">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Primary Evidence Base</h4>
            <div className="h-[2px] bg-slate-100 flex-grow rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sources.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm group"
              >
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600">{source.title}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{new URL(source.uri).hostname}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsResults;
