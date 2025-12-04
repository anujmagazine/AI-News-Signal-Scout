import React from 'react';
import { Layers, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="text-center mb-10 pt-8 animate-fade-in">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-black rounded-full text-white shadow-lg shadow-blue-500/20">
          <Layers size={32} />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          AI SIFT News Engine
        </h1>
        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full border border-blue-200 flex items-center gap-1">
          <Sparkles size={10} />
          AI Powered
        </span>
      </div>
      <p className="text-lg text-gray-500 font-medium mb-6 max-w-2xl mx-auto">
        Automated SIFT Framework (Scan, Identify, Filter, Take Action) for Leaders.
        <br/>
        <span className="text-sm text-gray-400">Upload your profile to get personalized, actionable AI intelligence.</span>
      </p>
    </div>
  );
};

export default Header;