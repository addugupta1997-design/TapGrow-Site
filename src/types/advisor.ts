import { BusinessCategory, MainGoal } from './assessment';
import { BusinessIntelligenceProfile } from '../features/recommendations/businessProfile';

export interface StructuredAdviceSection {
  understanding?: string;
  observation?: string;
  recommendedSolution?: string;
  stepByStep?: string[];
  estimatedEffort?: string;
  expectedBenefit?: string;
  suggestedNextAction?: string;
}

export type MessageSource = 'gemini' | 'local_engine';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  source?: MessageSource;
  structuredAdvice?: StructuredAdviceSection;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface MarketingStrategySection {
  title: string;
  summary: string;
  points: string[];
}

export interface GeneratedMarketingStrategy {
  id: string;
  businessName: string;
  businessCategory: BusinessCategory;
  categoryLabel: string;
  createdAt: string;
  businessOverview: MarketingStrategySection;
  currentSituation: MarketingStrategySection;
  mainOpportunities: MarketingStrategySection;
  shortTermPriorities: MarketingStrategySection;
  longTermObjectives: MarketingStrategySection;
  recommendedChannels: MarketingStrategySection;
  implementationSteps: MarketingStrategySection;
  successMeasurements: MarketingStrategySection;
  markdownContent: string;
}

export interface AdvisorServiceStatus {
  configured: boolean;
  provider: 'gemini' | 'local';
  model?: string;
  notice?: string;
}
