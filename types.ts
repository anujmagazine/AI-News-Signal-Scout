
import { LucideIcon } from 'lucide-react';

export interface NewsItem {
  id: string;
  category: 'strategic' | 'ground-level';
  headline: string;
  source: string;
  date: string;
  summary: string;
  relevance: string;
  priority: 'High' | 'Medium' | 'Low';
  action: string;
  actionReason: string;
  scenario?: string; // Specific for ground-level view
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AppState {
  step: 'input' | 'sifting' | 'results';
  profession: string;
  file: File | null;
  newsItems: NewsItem[];
  groundingSources: GroundingSource[];
  analysisContext: string;
  error: string | null;
}

export type ScanResult = 'noise' | 'signal' | null;

export type IdentifyResult = 'low' | 'relevant' | null;

export type FilterResult = 'completed' | null;

export type ActionSelection = string | null;

export interface ActionOption {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}
