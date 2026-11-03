import { BusinessCategory } from './assessment';

export type ContentPlatform =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'google_business'
  | 'other';

export type ContentType =
  | 'reel'
  | 'image_post'
  | 'carousel'
  | 'story'
  | 'short_video'
  | 'blog_article'
  | 'other';

export type ContentStatus = 'idea' | 'draft' | 'ready' | 'published';

export interface ContentItem {
  id: string;
  title: string;
  platform: ContentPlatform;
  contentType: ContentType;
  caption: string;
  description?: string;
  hashtags: string[];
  callToAction?: string;
  scheduledDate?: string; // YYYY-MM-DD
  status: ContentStatus;
  campaignId?: string; // ID of linked campaign if applicable
  createdAt: string;
  updatedAt: string;
}

export type CampaignStatus = 'planning' | 'active' | 'paused' | 'completed';

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  description: string;
  targetAudience: string;
  marketingChannel: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  budget?: string; // User-provided budget string e.g. "$150"
  status: CampaignStatus;
  notes?: string;
  userResults?: string; // Explicitly user-entered tracking notes/metrics
  createdAt: string;
  updatedAt: string;
}

export type IdeaCategory =
  | 'social_media'
  | 'reel_hooks'
  | 'campaign_ideas'
  | 'promotional_offers'
  | 'blog_topics'
  | 'local_marketing'
  | 'customer_engagement'
  | 'ai_strategies'
  | 'other';

export interface SavedIdea {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  tags: string[];
  isFavourite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MarketingNote {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceData {
  schemaVersion: number;
  contents: ContentItem[];
  campaigns: Campaign[];
  ideas: SavedIdea[];
  notes: MarketingNote[];
  lastExportedAt?: string;
}

export type WorkspaceSubTab = 'overview' | 'content' | 'campaigns' | 'ideas' | 'notes';
