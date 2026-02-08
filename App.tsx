
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
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

  const parseResponse = (text: string): { context: string; items: NewsItem[] } => {
    const parts = text.split('|||').map(s => s.trim());
    
    const contextHeader = parts[0] || '';
    const analysisContext = contextHeader.replace(/^(Analysis Context:|Context Analysis:)/i, '').trim();
    
    const items: NewsItem[] = [];
    const rawItems = parts.slice(1).filter(s => s.length > 0);

    rawItems.forEach((raw, index) => {
      const lines = raw.split('\n');
      const item: any = { id: `news-${index}`, category: 'strategic' };
      
      lines.forEach(line => {
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

    return { context: analysisContext, items };
  };

  const handleSift = async (profession: string, file: File | null) => {
    setState(prev => ({ ...prev, profession, file, step: 'sifting', error: null }));

    try {
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
        You are an elite intelligence analyst for a leader. 
        Apply the SIFT framework to find and process AI news from the last month (${oneMonthAgoStr} to ${todayStr}).

        USER PROFILE:
        ${profession}
        ${file ? "[Profile document attached]" : ""}

        TASK:
        1. FIRST, provide a brief "Analysis Context" on the user's strategic focus.
        2. Deliver exactly 4-6 high-signal items split into TWO categories:

        CATEGORY 1: Strategic View (10,000-ft perspective – “Direction Sense”)
        - Focus: Where AI has reached, where it is headed, reshaping of asset-heavy industries, governance, and risk.
        - Field mapping: Category: Strategic

        CATEGORY 2: Ground-level View (Execution Sense)
        - Focus: Modern AI tools, frontier models applied, and a realistic "Day-in-the-life" scenario for this user.
        - Field mapping: Category: Ground-level
        - Additional Field: Scenario: [A specific day-in-the-life example]

        OUTPUT FORMAT:
        Analysis Context: [Summary]
        |||
        Category: Strategic
        Headline: [Title]
        Source: [Source]
        Date: [Date]
        Summary: [Summary]
        Relevance: [Strategic impact]
        Priority: [High/Medium/Low]
        Action: [Next Step]
        Reason: [Why this action]
        |||
        Category: Ground-level
        Headline: [Tool/Model Title]
        ...
        Scenario: [How the user uses this today]
        ...
        (Use "|||" strictly as item separator)
      `;

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: {
          tools: [{ googleSearch: {} }],
        }
      });

      const text = response.text || '';
      const { context, items: newsItems } = parseResponse(text);
      
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
        newsItems,
        analysisContext: context,
        groundingSources: sources
      }));

    } catch (err: any) {
      console.error("SIFT Error:", err);
      setState(prev => ({
        ...prev,
        step: 'input',
        error: "Failed to analyze news. Please try again."
      }));
    }
  };

  const handleReset = () => {
    setState(prev => ({ ...prev, step: 'input', newsItems: [], groundingSources: [], analysisContext: '' }));
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        {state.step === 'input' && (
          <InputForm onSift={handleSift} isLoading={false} />
        )}

        {state.step === 'sifting' && (
          <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in">
             <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
             <h2 className="text-2xl font-bold mb-2">Analyzing the Signal...</h2>
             <p className="text-gray-500">Scanning global news, synthesizing strategic perspectives, and mapping ground-level execution scenarios.</p>
          </div>
        )}

        {state.step === 'results' && (
          <NewsResults 
            items={state.newsItems} 
            sources={state.groundingSources} 
            analysisContext={state.analysisContext}
            onReset={handleReset} 
          />
        )}

        {state.error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg z-50">
            {state.error}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
