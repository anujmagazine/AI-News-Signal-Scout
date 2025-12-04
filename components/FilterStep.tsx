import React from 'react';
import { Filter } from 'lucide-react';
import StepCard from './StepCard';
import { FILTER_CRITERIA } from '../constants';
import { FilterResult } from '../types';

interface FilterStepProps {
  onComplete: () => void;
  result: FilterResult;
}

const FilterStep: React.FC<FilterStepProps> = ({ onComplete, result }) => {
  const isCompleted = result === 'completed';

  return (
    <StepCard 
      title="Step 3: FILTER" 
      durationHint="~20 seconds" 
      icon={<Filter size={24} />}
      isActive={true}
    >
      <div className="animate-fade-in">
        <p className="mb-4 font-medium text-lg">How should we prioritize this?</p>
        
        <ul className="list-disc pl-5 mb-8 space-y-1 text-gray-600">
          {FILTER_CRITERIA.map((criterion, idx) => (
            <li key={idx}>{criterion}</li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onComplete}
            disabled={isCompleted}
            className={`w-full sm:w-auto py-3 px-8 rounded-lg font-semibold transition-all shadow-sm mx-auto block
              ${isCompleted
                ? 'bg-black text-white border-2 border-black cursor-default'
                : 'bg-black text-white hover:bg-gray-800 border-2 border-transparent'
              }`}
          >
            {isCompleted ? "Priority Decided" : "Decide Action Priority"}
          </button>
        </div>
      </div>
    </StepCard>
  );
};

export default FilterStep;