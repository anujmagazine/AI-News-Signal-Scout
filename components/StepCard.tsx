import React, { ReactNode } from 'react';

interface StepCardProps {
  title: string;
  durationHint?: string;
  icon?: ReactNode;
  children: ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
}

const StepCard: React.FC<StepCardProps> = ({ 
  title, 
  durationHint, 
  icon, 
  children, 
  isActive = true,
  isDisabled = false
}) => {
  return (
    <div className={`
      relative bg-white border rounded-xl shadow-sm overflow-hidden transition-all duration-500 mb-6
      ${isActive ? 'opacity-100 translate-y-0' : 'opacity-50 grayscale'}
      ${isDisabled ? 'pointer-events-none' : ''}
      border-gray-200
    `}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {icon && <div className="text-gray-800">{icon}</div>}
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          {durationHint && (
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
              {durationHint}
            </span>
          )}
        </div>
        
        <div className="text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StepCard;