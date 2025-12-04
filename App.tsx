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
    error: null,
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const parseResponse = (text: string): NewsItem[] => {
    const items: NewsItem[] = [];
    // Split by the delimiter |||
    const rawItems = text.split('|||').map(s => s.trim()).filter(s => s.length > 0);

    rawItems.forEach((raw, index) => {
      const lines = raw.split('\n');
      const item: any = { id: `news-${index}` };
      
      lines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim();
          const lowerKey = key.trim().toLowerCase();
          
          if (lowerKey.includes('headline')) item.headline = value;
          else if (lowerKey.includes('source')) item.source = value;
          else if (lowerKey.includes('summary')) item.summary = value;
          else if (lowerKey.includes('relevance')) item.relevance = value;
          else if (lowerKey.includes('priority')) item.priority = value as any;
          else if (lowerKey.includes('action') && !lowerKey.includes('reason')) item.action = value;
          else if (lowerKey.includes('reason')) item.actionReason = value;
        }
      });

      if (item.headline && item.summary) {
        items.push(item as NewsItem);
      }
    });

    return items;
  };

  const handleSift = async (profession: string, file: File | null) => {
    setState(prev => ({ ...prev, profession, file, step: 'sifting', error: null }));

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: any[] = [];

      // Add file if exists
      if (file) {
        const base64Data = await fileToBase64(file);
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: file.type
          }
        });
      }

      // Construct prompt
      const promptText = `
        You are an elite intelligence analyst for a leader. 
        Your goal is to apply the SIFT framework (Scan, Identify, Filter, Take Action) to find and process AI news.
        
        USER PROFILE:
        ${profession}
        ${file ? "[A profile document is also attached for context]" : ""}

        TASK:
        1. Search Google for the most significant AI news, trends, or breakthroughs from the last 7-14 days.
        2. STRICTLY FILTER: Only select items that are highly relevant to this user's specific profile and industry. Discard generic hype.
        3. Analyze the top 3-5 items using SIFT.

        OUTPUT FORMAT:
        Output a list of items separated by "|||".
        Inside each item, use exactly this format (plain text, no markdown bolding for keys):
        
        Headline: [Concise Title]
        Source: [Source Name]
        Summary: [2-sentence executive summary]
        Relevance: [Why this matters to the user's specific role]
        Priority: [High/Medium/Low]
        Action: [Recommended action: Archive / Monitor / Discuss / Delegate / Experiment]
        Reason: [Brief justification for the action]
        |||
      `;

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
          tools: [{ googleSearch: {} }],
        }
      });

      const text = response.text || '';
      const newsItems = parseResponse(text);
      
      // Extract grounding sources
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
        groundingSources: sources
      }));

    } catch (err: any) {
      console.error("SIFT Error:", err);
      setState(prev => ({
        ...prev,
        step: 'input',
        error: "Failed to sift news. Please try again or check your API key configuration."
      }));
    }
  };

  const handleReset = () => {
    setState(prev => ({ ...prev, step: 'input', newsItems: [], groundingSources: [] }));
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
             <h2 className="text-2xl font-bold mb-2">Sifting the Signal...</h2>
             <p className="text-gray-500">Scanning global news, analyzing relevance to your profile, and prioritizing actions.</p>
          </div>
        )}

        {state.step === 'results' && (
          <NewsResults 
            items={state.newsItems} 
            sources={state.groundingSources} 
            onReset={handleReset} 
          />
        )}

        {state.error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg">
            {state.error}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
