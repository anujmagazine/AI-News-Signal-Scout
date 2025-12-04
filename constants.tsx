import { Archive, Eye, MessageSquare, Users, FlaskConical } from 'lucide-react';
import { ActionOption } from './types';

export const CORE_PRINCIPLES = [
  "Manage information overload effectively.",
  "Distinguish significant signals from noise.",
  "Align AI developments with strategic goals."
];

export const SCAN_CRITERIA = [
  "Source: Is it credible and authoritative?",
  "Claim: Is it verifiable and specific?",
  "Pattern: Does it match a Key Development Pattern?"
];

export const PATTERNS_EXPLANATION = [
  { term: "Breakthrough", def: "A fundamental advance in capability." },
  { term: "Application", def: "New practical use case of existing tech." },
  { term: "Regulation/Policy", def: "New legal or ethical constraint/guideline." },
  { term: "Market Shift", def: "Major funding, acquisition, or competitor move." }
];

export const IDENTIFY_CRITERIA = [
  "Role Impact: Does this affect my specific responsibilities?",
  "Problem/Opportunity: Does it solve a known problem or offer a new advantage?",
  "Strategic Fit: Does it align with current organizational goals?"
];

export const FILTER_CRITERIA = [
  "Potential Impact: High, Medium, or Low?",
  "Urgency: Immediate action vs. future consideration?",
  "Actionability: Can we actually do something about this now?"
];

export const ACTION_OPTIONS: ActionOption[] = [
  {
    id: 'archive',
    title: 'Archive / Monitor',
    description: 'Log it for later reference. No immediate action.',
    icon: Archive
  },
  {
    id: 'watch',
    title: 'Personal Watch',
    description: 'Keep a close eye on this personally.',
    icon: Eye
  },
  {
    id: 'discuss',
    title: 'Discuss & Strategize',
    description: 'Bring to the next leadership meeting.',
    icon: MessageSquare
  },
  {
    id: 'delegate',
    title: 'Delegate & Track',
    description: 'Assign to a team member to investigate.',
    icon: Users
  },
  {
    id: 'experiment',
    title: 'Experiment',
    description: 'Launch a small pilot or proof-of-concept.',
    icon: FlaskConical
  }
];

export const MISSION_QUESTIONS = [
  "Does this action directly support our top strategic priorities?",
  "Do we have the resources (time, people, budget) to sustain this action?",
  "Is the expected outcome clear and valuable enough to justify the effort?"
];