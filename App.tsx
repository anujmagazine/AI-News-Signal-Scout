
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
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
    strategicSummary: string; 
    groundLevelSummary: string; 
    items: NewsItem[] 
  } => {
    const parts = text.split('|||').map(s => s.trim());
    
    const headerSection = parts[0] || '';
    const lines = headerSection.split('\n');
    
    let analysisContext = '';
    let strategicSummary = '';
    let groundLevelSummary = '';

    lines.forEach(line => {
      const lower = line.toLowerCase().trim();
      if (lower.startsWith('analysis context:')) analysisContext = line.split(':')[1]?.trim() || '';
      else if (lower.startsWith('strategic summary:')) strategicSummary = line.split(':')[1]?.trim() || '';
      else if (lower.startsWith('ground-level summary:')) groundLevelSummary = line.split(':')[1]?.trim() || '';
    });
    
    const items: NewsItem[] = [];
    const rawItems = parts.slice(1).filter(s => s.length > 0);

    rawItems.forEach((raw, index) => {
      const itemLines = raw.split('\n');
      const item: any = { id: `news-${index}`, category: 'strategic' };
      
      itemLines.forEach(line => {
        const splitIdx = line.indexOf(':');
        if (splitIdx !== -1) {
          const key = line.substring(0, splitIdx).trim().toLowerCase();
          const value = line.substring(splitIdx + 1).trim();
          
          if (key.includes('category')) {
            item.category = value.toLowerCase().includes('ground') ? 'ground-level' : 'strategic';
          }
          else if (key.includes('headline')) item.headline = value;
          else if (key.includes('source')) item.source = value;
          else if (key.includes('date')) item.date = value;
          else if (key.includes('summary')) item.summary = value;
          else if (key.includes('relevance')) item.relevance = value;
          else if (key.includes('priority')) item.priority = value as any;
          else if (key.includes('action') && !key.includes('reason')) item.action = value;
          else if (key.includes('reason')) item.actionReason = value;
          else if (key.includes('scenario')) item.scenario = value;
        }
      });

      if (item.headline && item.summary) {
        items.push(item as NewsItem);
      }
    });

    return { context: analysisContext, strategicSummary, groundLevelSummary, items };
  };

  const handleSift = async (profession: string, file: File | null) => {
    setState(prev => ({ ...prev, profession, file, step: 'sifting', error: null }));

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: any[] = [];

      if (file) {
        if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
          const base64Data = await fileToBase64(file);
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: file.type
            }
          });
        } else {
          try {
            const text = await file.text();
            parts.push({ text: `USER PROFILE DOCUMENT CONTENT:\n${text}` });
          } catch (e) {
            console.warn("Could not read file as text, skipping file part.");
          }
        }
      }

      const today = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      
      const todayStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const oneMonthAgoStr = oneMonthAgo.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      const baseSignalLayer = `
        BASE SIGNAL LAYER (Categorized Trusted Sources):
        - Labs: OpenAI, Anthropic, Google DeepMind, Meta AI Research, Mistral, Microsoft Research.
        - Technical: Hugging Face, GitHub Engineering.
        - Strategic: Sequoia Capital, a16z (Andreessen Horowitz), Y Combinator.
        - Reputable News: The Information, Wired, TechCrunch.
      `;

      const promptText = `
        You are a world-class strategic intelligence analyst. 
        Your task is to synthesize the latest AI news strictly from the last 30 days (${oneMonthAgoStr} to ${todayStr}) for a specific leader.

        USER PROFILE:
        ${profession}

        ${baseSignalLayer}

        **CATEGORIES:**
        **1. STRATEGIC (The 'Why' & 'Where'):**
        *   Macro-trends, regulation/policy, major industry shifts, ethical debates, and competitor moves.
        *   *Goal:* High-level situational awareness.

        **2. GROUND-LEVEL (The 'How' & 'What'):**
        *   **STRICT REQUIREMENT:** Must be tangible **Software Tools**, **Model Releases**, **Code Libraries**, **Prompt Techniques**, or **Specific 'How-To' Guides**.
        *   **EXCLUSION:** Do NOT put general news, op-eds, or future predictions here.
        *   *Goal:* Something the user can actually use, download, or implement in their workflow *today*.

        2. DYNAMIC DOMAIN INFERENCE:
        Based on the user's profile, IDENTIFY 3-5 top-tier, authoritative industry publications or academic journals.

        3. SEARCH MANDATE & FILTERING:
        - SEARCH SCOPE: SEARCH ONLY within the Categorized Base Signal Layer list above AND the high-authority domain sources you identified.
        - FILTERING: Rigorous exclusion of generic tech blogs.

        MANDATE:
        1. PROFILE SYNTHESIS: Provide "Analysis Context" (Strictly summarize the USER PROFILE in 2-3 highly relevant sentences, identifying specific goals, industry focus, and professional constraints found in the profile. Ensure it feels tailored and authoritative. Example: 'Intelligence tailored for a high-level corporate legal founder and board member focused on M&A, PE/VC, and legal talent development in India. The focus is on leveraging AI for cross-border transaction efficiency and developing new legal services frameworks.').
        2. QUANTITY: Target 5 high-signal Strategic items and 5 high-signal Ground-level items. **If genuine new tools are scarce for this specific profession, fill the Ground-level slots with specific "Use Case Scenarios" of major models (e.g. how to use Gemini 1.5 Pro for [User's Task]), rather than generic news.**
        3. OUTPUT REQUIREMENT: Citation field MUST cite the Primary Source.

        OUTPUT FORMAT (Use ||| strictly as the separator between sections):
        Analysis Context: [2-3 sentence profile summary]
        Strategic Summary: [Dashboard summary sentence]
        Ground-level Summary: [Dashboard summary sentence]
        |||
        Category: Strategic
        Headline: [Title]
        Source: [Source]
        Date: [Date]
        Summary: [Summary]
        Relevance: [Why this matters to user]
        Priority: [High/Medium/Low]
        Action: [Strategic Move]
        Reason: [Justification]
        |||
        (Repeat 10 times total)
      `;

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.1,
        }
      });

      const text = response.text || '';
      const parsed = parseResponse(text);
      
      const sources: GroundingSource[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });

      if (parsed.items.length === 0) {
        throw new Error("No intelligence items could be extracted. Please refine your profile.");
      }

      setState(prev => ({
        ...prev,
        step: 'results',
        newsItems: parsed.items,
        analysisContext: parsed.context,
        strategicSummary: parsed.strategicSummary,
        groundLevelSummary: parsed.groundLevelSummary,
        groundingSources: sources
      }));

    } catch (err: any) {
      console.error("SIFT Error:", err);
      const errorMessage = err?.message?.includes("User location") 
        ? "Please enable location access for more localized results." 
        : "Gathering failed. Please refine your profile and try again.";
        
      setState(prev => ({
        ...prev,
        step: 'input',
        error: errorMessage
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
      strategicSummary: '',
      groundLevelSummary: '',
      error: null
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
          <div className="max-w-2xl mx-auto text-center py-32 animate-fade-in">
             <div className="relative w-24 h-24 mx-auto mb-10">
                <div className="absolute inset-0 border-4 border-blue-600/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
             <h2 className="text-3xl font-black mb-4 tracking-tight text-slate-900">Identifying Relevant Signals</h2>
             <div className="space-y-3">
               <p className="text-slate-500 text-lg font-medium">Scanning frontier AI labs and research papers.</p>
               <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Cross-referencing with your profile...</p>
             </div>
          </div>
        )}

        {state.step === 'results' && (
          <NewsResults 
            items={state.newsItems} 
            sources={state.groundingSources} 
            analysisContext={state.analysisContext}
            strategicSummary={state.strategicSummary}
            groundLevelSummary={state.groundLevelSummary}
            onReset={handleReset} 
          />
        )}

        {state.error && (
          <div className="fixed bottom-6 right-6 bg-rose-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-3">
            <AlertTriangle size={20} />
            <span className="font-bold">{state.error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
