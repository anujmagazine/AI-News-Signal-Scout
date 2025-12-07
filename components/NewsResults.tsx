import React from 'react';
import { ExternalLink, ShieldAlert, Target, Play, RefreshCw, AlertTriangle, Calendar } from 'lucide-react';
import { NewsItem, GroundingSource } from '../types';

interface NewsResultsProps {
  items: NewsItem[];
  sources: GroundingSource[];
  onReset: () => void;
}

const NewsResults: React.FC<NewsResultsProps> = ({ items, sources, onReset }) => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Strategic Signals</h2>
          <p className="text-gray-500">Top prioritized insights based on your profile</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm"
        >
          <RefreshCw size={14} />
          New Search
        </button>
      </div>

      <div className="space-y-8">
        {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
                <h3 className="text-lg font-bold text-gray-900">No signals found</h3>
                <p className="text-gray-500">We couldn't find high-relevance news for this specific query. Try broadening your role description.</p>
            </div>
        ) : items.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Header / Scan */}
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
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
              <div className="bg-white p-6">
                <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold text-sm uppercase tracking-wide">
                  <Target size={16} />
                  Why It Matters
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
        ))}
      </div>

      {sources.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Verified Sources & References</h4>
          <div className="flex flex-wrap gap-3">
            {sources.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200 hover:bg-white hover:border-gray-300 hover:text-blue-600 transition-colors truncate max-w-md"
              >
                <ExternalLink size={10} />
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