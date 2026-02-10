
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
// Added AlertTriangle import from lucide-react
import { AlertTriangle } from 'lucide-react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import NewsResults from './components/NewsResults';
import { AppState, NewsItem, GroundingSource } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'input',
    profession: '',
    file: null,
    newsItems: [],
    groundingSources: [],
    analysisContext: '',
    profileFocusAreas: [],
    strategicSummary: '',
    groundLevelSummary: '',
    error: null,
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const parseResponse = (text: string): { 
    context: string; 
    focusAreas: string[];
    strategicSummary: string; 
    groundLevelSummary: string; 
    items: NewsItem[] 
  } => {
    const parts = text.split('|||').map(s => s.trim());
    
    const headerSection = parts[0] || '';
    const lines = headerSection.split('\n');
    
    let analysisContext = '';
    let focusAreas: string[] = [];
    let strategicSummary = '';
    let groundLevelSummary = '';

    lines.forEach(line => {
      const lower = line.toLowerCase().trim();
      if (lower.startsWith('analysis context:')) analysisContext = line.split(':')[1]?.trim() || '';
      else if (lower.startsWith('focus areas:')) focusAreas = line.split(':')[1]?.split(';').map(f => f.trim()) || [];
      else if (lower.startsWith('strategic summary:')) strategicSummary = line.split(':')[1]?.trim() || '';
      else if (lower.startsWith('ground-level summary:')) groundLevelSummary = line.split(':')[1]?.trim() || '';
    });
    
    const items: NewsItem[] = [];
    const rawItems = parts.slice(1).filter(s => s.length > 0);

    rawItems.forEach((raw, index) => {
      const itemLines = raw.split('\n');
      const item: any = { id: `news-${index}`, category: 'strategic' };
      
      itemLines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim();
          const lowerKey = key.trim().toLowerCase();
          
          if (lowerKey.includes('category')) {
            item.category = value.toLowerCase().includes('ground') ? 'ground-level' : 'strategic';
          }
          else if (lowerKey.includes('headline')) item.headline = value;
          else if (lowerKey.includes('source')) item.source = value;
          else if (lowerKey.includes('date')) item.date = value;
          else if (lowerKey.includes('summary')) item.summary = value;
          else if (lowerKey.includes('relevance')) item.relevance = value;
          else if (lowerKey.includes('priority')) item.priority = value as any;
          else if (lowerKey.includes('action') && !lowerKey.includes('reason')) item.action = value;
          else if (lowerKey.includes('reason')) item.actionReason = value;
          else if (lowerKey.includes('scenario')) item.scenario = value;
        }
      });

      if (item.headline && item.summary) {
        items.push(item as NewsItem);
      }
    });

    return { context: analysisContext, focusAreas, strategicSummary, groundLevelSummary, items };
  };

  const handleSift = async (profession: string, file: File | null) => {
    setState(prev => ({ ...prev, profession, file, step: 'sifting', error: null }));

    try {
      // Use the API KEY from process.env
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: any[] = [];

      if (file) {
        const base64Data = await fileToBase64(file);
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: file.type
          }
        });
      }

      const today = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      
      const todayStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const oneMonthAgoStr = oneMonthAgo.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      const promptText = `
        You are a world-class strategic intelligence analyst. 
        Your task is to synthesize the latest AI news strictly from the last 30 days (${oneMonthAgoStr} to ${todayStr}) for a specific leader.

        USER PROFILE:
        ${profession}
        ${file ? "[Profile document attached]" : ""}

        MANDATE:
        1. PROFILE SYNTHESIS: Summarize the user's "Focus Areas" (3-5 specific domains or challenges they care about based on their profile).
        2. QUANTITY: Find EXACTLY 5 high-signal Strategic View items and EXACTLY 5 high-signal Ground-level View items.
        3. COVERAGE: 
           - Include major labs (OpenAI, Google, Anthropic, Microsoft, Meta).
           - Include specialized AI companies or research relevant specifically to the user's industry/domain.
        
        CATEGORIES:
        - STRATEGIC (Direction Sense): Reshaping industries, ethics, governance, major model releases (e.g. GPT-5, Gemini 3), market shifts.
        - GROUND-LEVEL (Execution Sense): Practical tools, frontier features, specific workflow applications, "Day-in-the-life" scenarios.

        OUTPUT FORMAT (Use ||| strictly as the separator between sections):
        Analysis Context: [Brief 1-sentence analytical theme]
        Focus Areas: [Area 1; Area 2; Area 3]
        Strategic Summary: [Concise summary sentence for high-level dashboard]
        Ground-level Summary: [Concise summary sentence for high-level dashboard]
        |||
        Category: Strategic
        Headline: [Concise Title]
        Source: [Source]
        Date: [Date]
        Summary: [Concise executive summary]
        Relevance: [Why this matters specifically to the user]
        Priority: [High/Medium/Low]
        Action: [Specific Strategic Move]
        Reason: [Justification]
        |||
        (Repeat for all items, ensuring 5 per category)
      `;

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts },
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.1, // Higher precision
        }
      });

      // Directly access .text property
      const text = response.text || '';
      const parsed = parseResponse(text);
      
      const sources: GroundingSource[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });

      setState(prev => ({
        ...prev,
        step: 'results',
        newsItems: parsed.items,
        analysisContext: parsed.context,
        profileFocusAreas: parsed.focusAreas,
        strategicSummary: parsed.strategicSummary,
        groundLevelSummary: parsed.groundLevelSummary,
        groundingSources: sources
      }));

    } catch (err: any) {
      console.error("SIFT Error:", err);
      setState(prev => ({
        ...prev,
        step: 'input',
        error: "Intelligence gathering failed. Please check your role description and try again."
      }));
    }
  };

  const handleReset = () => {
    setState(prev => ({ 
      ...prev, 
      step: 'input', 
      newsItems: [], 
      groundingSources: [], 
      analysisContext: '',
      profileFocusAreas: [],
      strategicSummary: '',
      groundLevelSummary: '' 
    }));
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        {state.step === 'input' && (
          <InputForm onSift={handleSift} isLoading={false} />
        )}

        {state.step === 'sifting' && (
          <div className="max-w-2xl mx-auto text-center py-24 animate-fade-in">
             <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
             <h2 className="text-3xl font-extrabold mb-3 tracking-tight">Sifting Global Intelligence</h2>
             <p className="text-slate-500 text-lg">Scanning major AI labs and industry-specific developments for signals relevant to your profile.</p>
          </div>
        )}

        {state.step === 'results' && (
          <NewsResults 
            items={state.newsItems} 
            sources={state.groundingSources} 
            analysisContext={state.analysisContext}
            profileFocusAreas={state.profileFocusAreas}
            strategicSummary={state.strategicSummary}
            groundLevelSummary={state.groundLevelSummary}
            onReset={handleReset} 
          />
        )}

        {state.error && (
          <div className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-3">
            <AlertTriangle size={20} />
            <span className="font-semibold">{state.error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
