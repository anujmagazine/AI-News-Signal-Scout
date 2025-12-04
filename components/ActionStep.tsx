import React from 'react';
import { Play } from 'lucide-react';
import StepCard from './StepCard';
import { ACTION_OPTIONS } from '../constants';
import { ActionSelection } from '../types';

interface ActionStepProps {
  onSelect: (actionId: string) => void;
  selectedAction: ActionSelection;
}

const ActionStep: React.FC<ActionStepProps> = ({ onSelect, selectedAction }) => {
  return (
    <StepCard 
      title="Step 4: TAKE ACTION" 
      icon={<Play size={24} />}
      isActive={true}
    >
      <div className="animate-fade-in">
        <p className="mb-6 font-medium text-lg">What is the next clear step?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {ACTION_OPTIONS.map((action) => {
            const Icon = action.icon;
            const isSelected = selectedAction === action.id;
            const isOtherSelected = selectedAction !== null && !isSelected;

            return (
              <button
                key={action.id}
                onClick={() => onSelect(action.id)}
                disabled={selectedAction !== null}
                className={`
                  p-4 rounded-xl border-2 text-left transition-all duration-300 relative overflow-hidden group
                  ${isSelected 
                    ? 'border-black bg-gray-50 shadow-md ring-1 ring-black/5' 
                    : isOtherSelected
                      ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed grayscale'
                      : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'
                  }
                `}
              >
                <div className={`mb-3 ${isSelected ? 'text-black' : 'text-gray-500 group-hover:text-gray-900'}`}>
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-500 leading-snug">{action.description}</p>
                
                {isSelected && (
                  <div className="absolute top-2 right-2 text-black">
                     <div className="w-2 h-2 rounded-full bg-black"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </StepCard>
  );
};

export default ActionStep;