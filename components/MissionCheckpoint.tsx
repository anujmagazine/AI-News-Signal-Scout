import React from 'react';
import { CheckCircle } from 'lucide-react';
import { MISSION_QUESTIONS } from '../constants';

const MissionCheckpoint: React.FC = () => {
  return (
    <div className="animate-fade-in mt-8 mb-12 p-6 bg-gray-900 text-white rounded-xl shadow-lg border border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="text-green-400" size={24} />
        <h2 className="text-xl font-bold">Mission Checkpoint</h2>
      </div>
      
      <p className="text-gray-300 mb-4 font-medium">
        Final check before proceeding:
      </p>
      
      <ul className="space-y-3">
        {MISSION_QUESTIONS.map((question, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div className="mt-1 min-w-[6px] min-h-[6px] rounded-full bg-green-400" />
            <span className="text-gray-200">{question}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-6 pt-4 border-t border-gray-700 text-center">
         <span className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Action Confirmed</span>
      </div>
    </div>
  );
};

export default MissionCheckpoint;