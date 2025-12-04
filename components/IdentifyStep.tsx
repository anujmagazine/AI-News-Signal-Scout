import React from 'react';
import { Target } from 'lucide-react';
import StepCard from './StepCard';
import { IDENTIFY_CRITERIA } from '../constants';
import { IdentifyResult } from '../types';

interface IdentifyStepProps {
  onDecide: (result: IdentifyResult) => void;
  result: IdentifyResult;
}

const IdentifyStep: React.FC<IdentifyStepProps> = ({ onDecide, result }) => {
  const isDecided = result !== null;

  return (
    <StepCard 
      title="Step 2: IDENTIFY" 
      durationHint="~30 seconds" 
      icon={<Target size={24} />}
      isDisabled={isDecided && result === 'low'}
    >
      <div className="animate-fade-in">
        <p className="mb-4 font-medium text-lg">Does this matter to me/us?</p>
        
        <ul className="list-disc pl-5 mb-8 space-y-1 text-gray-600">
          {IDENTIFY_CRITERIA.map((criterion, idx) => (
            <li key={idx}>{criterion}</li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onDecide('low')}
            disabled={isDecided}
            className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition-all
              ${result === 'low' 
                ? 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed' 
                : result === 'relevant'
                  ? 'opacity-50 cursor-not-allowed border-gray-200 text-gray-400'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
              }`}
          >
            Low Relevance
          </button>
          <button
            onClick={() => onDecide('relevant')}
            disabled={isDecided}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all shadow-sm
              ${result === 'relevant'
                ? 'bg-black text-white border-2 border-black cursor-default'
                : result === 'low'
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-2 border-transparent'
                  : 'bg-black text-white hover:bg-gray-800 border-2 border-transparent'
              }`}
          >
            Relevant
          </button>
        </div>

        {result === 'low' && (
          <div className="mt-4 p-4 bg-gray-100 border border-gray-200 text-gray-600 rounded-lg italic animate-fade-in">
            Decision: Monitor Lightly. No immediate strategic value found.
          </div>
        )}
        
        {result === 'relevant' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg font-medium animate-fade-in">
            Decision: Relevant. Proceeding to filtering...
          </div>
        )}
      </div>
    </StepCard>
  );
};

export default IdentifyStep;