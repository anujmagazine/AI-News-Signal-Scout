import React, { useState } from 'react';
import { Scan, ChevronDown, ChevronUp } from 'lucide-react';
import StepCard from './StepCard';
import { SCAN_CRITERIA, PATTERNS_EXPLANATION } from '../constants';
import { ScanResult } from '../types';

interface ScanStepProps {
  onDecide: (result: ScanResult) => void;
  result: ScanResult;
}

const ScanStep: React.FC<ScanStepProps> = ({ onDecide, result }) => {
  const [showPatterns, setShowPatterns] = useState(false);

  const isDecided = result !== null;

  return (
    <StepCard 
      title="Step 1: SCAN" 
      durationHint="~15 seconds" 
      icon={<Scan size={24} />}
      isDisabled={isDecided && result === 'noise'}
    >
      <p className="mb-4 font-medium text-lg">Is this signal or noise?</p>
      
      <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-600">
        {SCAN_CRITERIA.map((criterion, idx) => (
          <li key={idx}>{criterion}</li>
        ))}
      </ul>

      <div className="mb-6">
        <button 
          onClick={() => setShowPatterns(!showPatterns)}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          disabled={isDecided}
        >
          (What are these?)
          {showPatterns ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showPatterns ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
          <div className="bg-gray-100 p-4 rounded-lg text-sm border border-gray-200">
            <h4 className="font-bold mb-2 text-gray-800">Key AI Development Patterns:</h4>
            <ul className="space-y-2">
              {PATTERNS_EXPLANATION.map((item, idx) => (
                <li key={idx}>
                  <span className="font-semibold text-gray-900">{item.term}:</span> {item.def}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onDecide('noise')}
          disabled={isDecided}
          className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition-all
            ${result === 'noise' 
              ? 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed' 
              : result === 'signal'
                ? 'opacity-50 cursor-not-allowed border-gray-200 text-gray-400'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
            }`}
        >
          Likely Noise
        </button>
        <button
          onClick={() => onDecide('signal')}
          disabled={isDecided}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all shadow-sm
            ${result === 'signal'
              ? 'bg-black text-white border-2 border-black cursor-default'
              : result === 'noise'
                ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-2 border-transparent'
                : 'bg-black text-white hover:bg-gray-800 border-2 border-transparent'
            }`}
        >
          Potential Signal
        </button>
      </div>

      {result === 'noise' && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-200 text-gray-600 rounded-lg italic animate-fade-in">
          Decision: Archive (Noise). No further action needed.
        </div>
      )}
      
      {result === 'signal' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg font-medium animate-fade-in">
          Decision: Potential Signal. Proceeding to identification...
        </div>
      )}
    </StepCard>
  );
};

export default ScanStep;