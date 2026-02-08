
import React from 'react';
import { 
  ExternalLink, ShieldAlert, Target, Play, RefreshCw, 
  AlertTriangle, Calendar, UserCheck, Globe, Zap, Clock, ChevronRight
} from 'lucide-react';
import { NewsItem, GroundingSource } from '../types';

interface NewsResultsProps {
  items: NewsItem[];
  sources: GroundingSource[];
  analysisContext: string;
  strategicSummary: string;
  groundLevelSummary: string;
  onReset: () => void;
}

const NewsResults: React.FC<NewsResultsProps> = ({ 
  items, 
  sources, 
  analysisContext, 
  strategicSummary, 
  groundLevelSummary, 
  onReset 
}) => {
  const strategicItems = items.filter(item => item.category === 'strategic');
  const groundLevelItems = items.filter(item => item.category === 'ground-level');

  const renderNewsItem = (item: NewsItem) => (
    <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-start justify-between gap-4 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase tracking-wider">
            <ShieldAlert size={12} />
            Signal
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${item.priority === 'High' ? 'bg-red-100 text-red-700' : 
              item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}
          `}>
            {item.priority} Priority
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{item.headline}</h3>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-3">
          <span className="font-medium text-gray-700">{item.source}</span>
          <span>•</span>
          {item.date && (
            <>
              <span className="flex items-center gap-1 text-gray-600">
                <Calendar size={12} />
                {item.date}
              </span>
              <span>•</span>
            </>
          )}
          <span className="italic">AI Analysis</span>
        </div>
        <p className="text-gray-600 leading-relaxed">{item.summary}</p>
        
        {item.scenario && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
              <Clock size={14} />
              Day-in-the-life Scenario
            </div>
            <p className="text-sm text-purple-900 italic leading-relaxed">"{item.scenario}"</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
        <div className="bg-white p-6">
          <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold text-sm uppercase tracking-wide">
            <Target size={16} />
            {item.category === 'strategic' ? 'Strategic Significance' : 'Execution Impact'}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{item.relevance}</p>
        </div>

        <div className="bg-white p-6">
          <div className="flex items-center gap-2 mb-3 text-purple-700 font-bold text-sm uppercase tracking-wide">
            <Play size={16} />
            Recommended Action: {item.action}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{item.actionReason}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Intelligence Briefing</h2>
          <p className="text-gray-500">Synthesized perspectives for your specific persona</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm"
        >
          <RefreshCw size={14} />
          Refine Focus
        </button>
      </div>

      {analysisContext && (
        <div className="mb-8 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl flex gap-5 items-start">
          <div className="bg-blue-600 p-3 rounded-xl text-white mt-1 shrink-0 shadow-lg shadow-blue-500/20">
            <UserCheck size={24} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-2">Strategic Intelligence Context</h4>
            <p className="text-gray-100 leading-relaxed text-base">
              {analysisContext}
            </p>
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE SUMMARY DASHBOARD */}
      {(strategicSummary || groundLevelSummary) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Strategic View Summary */}
          <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4 text-blue-700">
              <Globe size={20} />
              <h4 className="font-bold text-sm uppercase tracking-widest">10,000-ft Horizon</h4>
            </div>
            <div className="space-y-3">
              {strategicSummary.split(/;|•|\n/).filter(s => s.trim().length > 0).map((point, i) => (
                <div key={i} className="flex gap-3 items-start group">
                  <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:scale-125 transition-transform" />
                  <p className="text-sm text-gray-700 leading-snug">{point.trim()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ground Level Summary */}
          <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4 text-orange-700">
              <Zap size={20} />
              <h4 className="font-bold text-sm uppercase tracking-widest">Execution Focus</h4>
            </div>
            <div className="space-y-3">
              {groundLevelSummary.split(/;|•|\n/).filter(s => s.trim().length > 0).map((point, i) => (
                <div key={i} className="flex gap-3 items-start group">
                  <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:scale-125 transition-transform" />
                  <p className="text-sm text-gray-700 leading-snug">{point.trim()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 1. STRATEGIC VIEW DETAILS */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Strategic Intelligence</h3>
              <p className="text-sm text-gray-500">Directional signals & long-term industry impact</p>
            </div>
          </div>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded uppercase tracking-tighter">View 01</span>
        </div>
        
        <div className="space-y-10">
          {strategicItems.length > 0 ? (
            strategicItems.map(renderNewsItem)
          ) : (
            <p className="text-gray-400 italic py-4">No high-level strategic signals identified for this window.</p>
          )}
        </div>
      </section>

      {/* 2. GROUND-LEVEL VIEW DETAILS */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-700 rounded-lg">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Execution Sense</h3>
              <p className="text-sm text-gray-500">Modern tools & pragmatic daily applications</p>
            </div>
          </div>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded uppercase tracking-tighter">View 02</span>
        </div>
        
        <div className="space-y-10">
          {groundLevelItems.length > 0 ? (
            groundLevelItems.map(renderNewsItem)
          ) : (
            <p className="text-gray-400 italic py-4">No tactical execution signals identified for this window.</p>
          )}
        </div>
      </section>

      {items.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-900">Zero Signals Detected</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Your filters might be too strict. Try broadening your role description or checking for recent industry shifts.</p>
        </div>
      )}

      {sources.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4 text-gray-400">
            <h4 className="text-sm font-bold uppercase tracking-widest">Evidence Base</h4>
            <div className="h-px bg-gray-200 flex-grow" />
          </div>
          <div className="flex flex-wrap gap-3">
            {sources.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-600 text-xs font-medium rounded-lg border border-gray-200 hover:border-black hover:text-black transition-all shadow-sm truncate max-w-xs"
              >
                <ExternalLink size={12} className="shrink-0" />
                {source.title || new URL(source.uri).hostname}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsResults;
