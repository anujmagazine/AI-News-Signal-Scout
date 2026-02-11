
import React, { useState, useRef } from 'react';
import { Upload, FileText, Search, X } from 'lucide-react';

interface InputFormProps {
  onSift: (profession: string, file: File | null) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSift, isLoading }) => {
  const [profession, setProfession] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const isReady = profession.trim().length > 0 || file !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReady) return;
    onSift(profession, file);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Personalize Your Briefing</h2>
          <p className="text-gray-500 text-sm mt-1">Provide a description OR upload a file to define your strategic context.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Role & Profession Description
              </label>
              {!file && !profession.trim() && (
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Required if no file</span>
              )}
            </div>
            <textarea
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="e.g. I am a CTO at a mid-sized fintech company focused on fraud detection and customer experience..."
              className="w-full h-32 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black transition-all resize-none text-gray-800"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 font-medium">OR</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Attach Profile / Resume (PDF or Text)
              </label>
              {!file && !profession.trim() && (
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Required if no text</span>
              )}
            </div>
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                ${file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
              `}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.txt"
                className="hidden"
              />
              
              {file ? (
                <div className="flex items-center justify-center gap-3 text-green-700">
                  <FileText size={24} />
                  <span className="font-medium truncate max-w-xs">{file.name}</span>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="p-1 hover:bg-green-200 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <Upload size={20} />
                  </div>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop PDF/TXT
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isReady}
            className={`
              w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-md
              ${isLoading || !isReady
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5'
              }
            `}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scanning Global News...
              </>
            ) : (
              <>
                <Search size={20} />
                Find relevant AI news for me
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
