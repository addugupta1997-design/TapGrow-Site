import {
  ContentItem,
  Campaign,
  SavedIdea,
  MarketingNote,
  WorkspaceData,
} from '../types/workspace';
import { AssessmentAnswers, BusinessCategory } from '../types/assessment';

export const WORKSPACE_STORAGE_KEY = 'tapgrow_workspace_data_v1';
export const WORKSPACE_SCHEMA_VERSION = 1;

let memoryStore: Record<string, string> = {};

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__workspace_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const storageAvailable = typeof window !== 'undefined' && isLocalStorageAvailable();

function getItem(key: string): string | null {
  if (storageAvailable) {
    return window.localStorage.getItem(key);
  }
  return memoryStore[key] || null;
}

function setItem(key: string, value: string): void {
  if (storageAvailable) {
    try {
      window.localStorage.setItem(key, value);
      return;
    } catch (err) {
      console.warn('LocalStorage write failed in workspace, falling back to memory store:', err);
    }
  }
  memoryStore[key] = value;
}

export function clearWorkspaceMemoryStore(): void {
  memoryStore = {};
}

/**
 * Returns tailored initial starter ideas and notes for new workspaces.
 */
function getInitialStarterPack(category?: BusinessCategory, businessName = 'Our Business'): {
  starterIdeas: SavedIdea[];
  starterNotes: MarketingNote[];
} {
  const now = new Date().toISOString();

  let starterIdea: SavedIdea;
  let starterNote: MarketingNote;

  switch (category) {
    case 'restaurant_cafe':
      starterIdea = {
        id: `idea_init_1`,
        title: 'Behind the Scenes: Chef Special Prep Reel',
        description: `Film a 15-second aesthetic video showing fresh morning ingredients being prepped. End with a call to reserve a table for lunch.`,
        category: 'social_media',
        tags: ['food_photography', 'reels', 'midweek_specials'],
        isFavourite: true,
        createdAt: now,
        updatedAt: now,
      };
      starterNote = {
        id: `note_init_1`,
        title: 'Midweek Dinner Foot Traffic Strategy',
        content: `Target slow Tuesday/Wednesday evenings by introducing a limited "Neighbourhood Table" 2-course menu. Share on Google Business Profile updates every Monday morning.`,
        category: 'Strategy',
        tags: ['hospitality', 'google_updates'],
        isPinned: true,
        createdAt: now,
        updatedAt: now,
      };
      break;

    case 'salon_wellness':
      starterIdea = {
        id: `idea_init_1`,
        title: 'Client Hair/Skin Transformation Carousel',
        description: `Post a 3-slide carousel showing consultation, in-process treatment, and final styled reveal with honest home care advice.`,
        category: 'reel_hooks',
        tags: ['transformation', 'client_showcase', 'instagram'],
        isFavourite: true,
        createdAt: now,
        updatedAt: now,
      };
      starterNote = {
        id: `note_init_1`,
        title: 'Chairside Rebooking Script',
        content: `While wrapping up appointments: "To ensure you get your preferred afternoon slot before the holidays fill up, let's reserve your 6-week refresh now. You can adjust it online anytime."`,
        category: 'Retention',
        tags: ['rebooking', 'client_care'],
        isPinned: true,
        createdAt: now,
        updatedAt: now,
      };
      break;

    case 'home_trades':
      starterIdea = {
        id: `idea_init_1`,
        title: 'Quick Homeowner Tip: Preventative Maintenance',
        description: `Short 30-second video demonstrating 1 simple check homeowners should do every season to prevent costly emergency callouts.`,
        category: 'local_marketing',
        tags: ['homeowner_tips', 'trust_building', 'expert_advice'],
        isFavourite: true,
        createdAt: now,
        updatedAt: now,
      };
      starterNote = {
        id: `note_init_1`,
        title: 'Service Radius & Response Guidelines',
        content: `Clarify 20-minute response area on website and Google profile. For suburbs outside primary radius, specify minimum project size or scheduled service days.`,
        category: 'Operations',
        tags: ['service_area', 'local_seo'],
        isPinned: true,
        createdAt: now,
        updatedAt: now,
      };
      break;

    case 'health_clinic':
      starterIdea = {
        id: `idea_init_1`,
        title: 'Meet the Practitioner & What to Expect on Day 1',
        description: `Demystify the first consultation. Show the welcoming reception, gentle intake procedure, and common questions new patients ask.`,
        category: 'customer_engagement',
        tags: ['patient_trust', 'first_visit', 'faq'],
        isFavourite: true,
        createdAt: now,
        updatedAt: now,
      };
      starterNote = {
        id: `note_init_1`,
        title: 'Ethical Review Collection Routine',
        content: `Never ask patients about medical conditions. Instead, invite feedback on punctuality, staff kindness, and clinic cleanliness via a short SMS survey after follow-up appointments.`,
        category: 'Compliance',
        tags: ['reviews', 'healthcare_ethics'],
        isPinned: true,
        createdAt: now,
        updatedAt: now,
      };
      break;

    case 'retail':
      starterIdea = {
        id: `idea_init_1`,
        title: 'New Arrival Unboxing & Staff Pick of the Week',
        description: `Show new products arriving on the sales floor. Have a team member share why this specific item is their personal favourite for local customers.`,
        category: 'social_media',
        tags: ['unboxing', 'staff_picks', 'in_store'],
        isFavourite: true,
        createdAt: now,
        updatedAt: now,
      };
      starterNote = {
        id: `note_init_1`,
        title: 'Local In-Store Foot Traffic Playbook',
        content: `Keep Google Business Profile store hours, weekend parking details, and phone number 100% synchronized with current holidays. Add 3 new high-res shelf photos every month.`,
        category: 'Visibility',
        tags: ['foot_traffic', 'store_photos'],
        isPinned: true,
        createdAt: now,
        updatedAt: now,
      };
      break;

    default:
      starterIdea = {
        id: `idea_init_1`,
        title: 'Local Community Partner Cross-Promotion',
        description: `Feature a neighbouring independent business that your customers also love. Tag them in a story proposing a collaborative seasonal giveaway.`,
        category: 'local_marketing',
        tags: ['partnerships', 'neighbourhood', 'community'],
        isFavourite: true,
        createdAt: now,
        updatedAt: now,
      };
      starterNote = {
        id: `note_init_1`,
        title: `Marketing Rhythm for ${businessName}`,
        content: `Dedicate 30 focused minutes every Monday morning to review review notifications, schedule 2 social posts, and check Google Maps search insights.`,
        category: 'Rhythm',
        tags: ['habits', 'weekly_cadence'],
        isPinned: true,
        createdAt: now,
        updatedAt: now,
      };
      break;
  }

  return {
    starterIdeas: [starterIdea],
    starterNotes: [starterNote],
  };
}

/**
 * Generates tailored initial workspace data for onboarding.
 */
export function generateStarterWorkspaceData(
  businessName = 'Our Business',
  category?: BusinessCategory
): WorkspaceData {
  const { starterIdeas, starterNotes } = getInitialStarterPack(category, businessName);
  const now = new Date().toISOString();

  const starterContent: ContentItem[] = [
    {
      id: `content_starter_1`,
      title: `${businessName} Weekly Feature Spotlight`,
      platform: 'instagram',
      contentType: 'reel',
      caption: `Discover what makes ${businessName} special! We take pride in delivering the highest quality experience to our local community. Visit us this week or check our link to learn more.`,
      hashtags: ['localbusiness', 'shoplocal', 'quality'],
      callToAction: 'Visit us this week or tap the link in bio',
      scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `content_starter_2`,
      title: 'Customer Appreciation & Review Highlight',
      platform: 'google_business',
      contentType: 'image_post',
      caption: `A huge thank you to our wonderful local customers for your continued support! Leave us a review if you enjoyed your visit.`,
      hashtags: ['community', 'supportlocal'],
      callToAction: 'Read our recent reviews on Google',
      scheduledDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      status: 'ready',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const starterCampaigns: Campaign[] = [
    {
      id: `camp_starter_1`,
      name: 'Local Community Awareness Drive',
      objective: 'Increase brand awareness and monthly visits by 25%',
      description: `Consistent multi-channel visibility focusing on high customer satisfaction, local search presence, and social engagement.`,
      targetAudience: 'Local residents and workers within 5 km radius',
      marketingChannel: 'Social Media & Google Business Profile',
      startDate: now.split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      budget: '$50 - $100',
      status: 'planning',
      notes: 'Focus on authentic photos, behind-the-scenes moments, and prompt review responses.',
      createdAt: now,
      updatedAt: now,
    },
  ];

  return {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    contents: starterContent,
    campaigns: starterCampaigns,
    ideas: starterIdeas,
    notes: starterNotes,
  };
}

/**
 * Loads entire workspace data, initializing empty state with starter templates if needed.
 */
export function loadWorkspaceData(answers?: AssessmentAnswers): WorkspaceData {
  try {
    const raw = getItem(WORKSPACE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          schemaVersion: parsed.schemaVersion || WORKSPACE_SCHEMA_VERSION,
          contents: Array.isArray(parsed.contents) ? parsed.contents : [],
          campaigns: Array.isArray(parsed.campaigns) ? parsed.campaigns : [],
          ideas: Array.isArray(parsed.ideas) ? parsed.ideas : [],
          notes: Array.isArray(parsed.notes) ? parsed.notes : [],
          lastExportedAt: parsed.lastExportedAt,
        };
      }
    }
  } catch (err) {
    console.error('Failed to parse workspace storage data:', err);
  }

  // Fresh initialization
  const initialData = generateStarterWorkspaceData(
    answers?.businessName || 'Our Business',
    answers?.category
  );

  saveWorkspaceData(initialData);
  return initialData;
}

/**
 * Saves entire workspace data to storage.
 */
export function saveWorkspaceData(data: WorkspaceData): void {
  try {
    setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save workspace data:', err);
  }
}

// ==========================================
// CONTENT ITEM CRUD
// ==========================================

export function saveContentItem(
  item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): ContentItem {
  const data = loadWorkspaceData();
  const now = new Date().toISOString();

  let saved: ContentItem;

  if (item.id) {
    const existingIndex = data.contents.findIndex((c) => c.id === item.id);
    if (existingIndex >= 0) {
      saved = {
        ...data.contents[existingIndex],
        ...item,
        id: item.id,
        updatedAt: now,
      };
      data.contents[existingIndex] = saved;
    } else {
      saved = {
        ...item,
        id: item.id,
        createdAt: now,
        updatedAt: now,
      };
      data.contents.unshift(saved);
    }
  } else {
    saved = {
      ...item,
      id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    data.contents.unshift(saved);
  }

  saveWorkspaceData(data);
  return saved;
}

export function duplicateContentItem(id: string): ContentItem | null {
  const data = loadWorkspaceData();
  const original = data.contents.find((c) => c.id === id);
  if (!original) return null;

  const now = new Date().toISOString();
  const duplicate: ContentItem = {
    ...original,
    id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: `${original.title} (Copy)`,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };

  data.contents.unshift(duplicate);
  saveWorkspaceData(data);
  return duplicate;
}

export function deleteContentItem(id: string): boolean {
  const data = loadWorkspaceData();
  const initialLen = data.contents.length;
  data.contents = data.contents.filter((c) => c.id !== id);
  if (data.contents.length !== initialLen) {
    saveWorkspaceData(data);
    return true;
  }
  return false;
}

// ==========================================
// CAMPAIGN CRUD
// ==========================================

export function saveCampaign(
  campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Campaign {
  const data = loadWorkspaceData();
  const now = new Date().toISOString();

  let saved: Campaign;

  if (campaign.id) {
    const idx = data.campaigns.findIndex((c) => c.id === campaign.id);
    if (idx >= 0) {
      saved = {
        ...data.campaigns[idx],
        ...campaign,
        id: campaign.id,
        updatedAt: now,
      };
      data.campaigns[idx] = saved;
    } else {
      saved = {
        ...campaign,
        id: campaign.id,
        createdAt: now,
        updatedAt: now,
      };
      data.campaigns.unshift(saved);
    }
  } else {
    saved = {
      ...campaign,
      id: `camp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    data.campaigns.unshift(saved);
  }

  saveWorkspaceData(data);
  return saved;
}

export function deleteCampaign(id: string): boolean {
  const data = loadWorkspaceData();
  const initialLen = data.campaigns.length;
  data.campaigns = data.campaigns.filter((c) => c.id !== id);

  // Unlink any content items that were linked to this campaign
  data.contents = data.contents.map((c) =>
    c.campaignId === id ? { ...c, campaignId: undefined } : c
  );

  if (data.campaigns.length !== initialLen) {
    saveWorkspaceData(data);
    return true;
  }
  return false;
}

// ==========================================
// IDEAS LIBRARY CRUD
// ==========================================

export function saveIdea(
  idea: Omit<SavedIdea, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): SavedIdea {
  const data = loadWorkspaceData();
  const now = new Date().toISOString();

  let saved: SavedIdea;

  if (idea.id) {
    const idx = data.ideas.findIndex((i) => i.id === idea.id);
    if (idx >= 0) {
      saved = {
        ...data.ideas[idx],
        ...idea,
        id: idea.id,
        updatedAt: now,
      };
      data.ideas[idx] = saved;
    } else {
      saved = {
        ...idea,
        id: idea.id,
        createdAt: now,
        updatedAt: now,
      };
      data.ideas.unshift(saved);
    }
  } else {
    saved = {
      ...idea,
      id: `idea_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    data.ideas.unshift(saved);
  }

  saveWorkspaceData(data);
  return saved;
}

export function toggleIdeaFavourite(id: string): SavedIdea | null {
  const data = loadWorkspaceData();
  const idea = data.ideas.find((i) => i.id === id);
  if (!idea) return null;

  idea.isFavourite = !idea.isFavourite;
  idea.updatedAt = new Date().toISOString();
  saveWorkspaceData(data);
  return idea;
}

export function deleteIdea(id: string): boolean {
  const data = loadWorkspaceData();
  const initialLen = data.ideas.length;
  data.ideas = data.ideas.filter((i) => i.id !== id);
  if (data.ideas.length !== initialLen) {
    saveWorkspaceData(data);
    return true;
  }
  return false;
}

export function convertIdeaToContentDraft(ideaId: string): ContentItem | null {
  const data = loadWorkspaceData();
  const idea = data.ideas.find((i) => i.id === ideaId);
  if (!idea) return null;

  const now = new Date().toISOString();
  const newContent: ContentItem = {
    id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: idea.title,
    platform: 'instagram',
    contentType: 'image_post',
    caption: `${idea.description}\n\nDrop a comment below or tap the link in our bio!`,
    description: `Created from Idea: ${idea.title}`,
    hashtags: idea.tags.length > 0 ? idea.tags : ['localbusiness', 'smallbusiness'],
    callToAction: 'Visit us or check link in bio',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };

  data.contents.unshift(newContent);
  saveWorkspaceData(data);
  return newContent;
}

export function convertIdeaToCampaign(ideaId: string): Campaign | null {
  const data = loadWorkspaceData();
  const idea = data.ideas.find((i) => i.id === ideaId);
  if (!idea) return null;

  const now = new Date().toISOString();
  const todayStr = now.split('T')[0];
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const newCampaign: Campaign = {
    id: `camp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: idea.title,
    objective: 'Increase local awareness and engagement',
    description: idea.description,
    targetAudience: 'Local residents & existing customers',
    marketingChannel: 'Social Media & Local Search',
    startDate: todayStr,
    endDate: nextMonth,
    status: 'planning',
    notes: `Derived from Saved Idea: ${idea.title}`,
    createdAt: now,
    updatedAt: now,
  };

  data.campaigns.unshift(newCampaign);
  saveWorkspaceData(data);
  return newCampaign;
}

// ==========================================
// MARKETING NOTES CRUD
// ==========================================

export function saveNote(
  note: Omit<MarketingNote, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): MarketingNote {
  const data = loadWorkspaceData();
  const now = new Date().toISOString();

  let saved: MarketingNote;

  if (note.id) {
    const idx = data.notes.findIndex((n) => n.id === note.id);
    if (idx >= 0) {
      saved = {
        ...data.notes[idx],
        ...note,
        id: note.id,
        updatedAt: now,
      };
      data.notes[idx] = saved;
    } else {
      saved = {
        ...note,
        id: note.id,
        createdAt: now,
        updatedAt: now,
      };
      data.notes.unshift(saved);
    }
  } else {
    saved = {
      ...note,
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    data.notes.unshift(saved);
  }

  saveWorkspaceData(data);
  return saved;
}

export function toggleNotePin(id: string): MarketingNote | null {
  const data = loadWorkspaceData();
  const note = data.notes.find((n) => n.id === id);
  if (!note) return null;

  note.isPinned = !note.isPinned;
  note.updatedAt = new Date().toISOString();
  saveWorkspaceData(data);
  return note;
}

export function deleteNote(id: string): boolean {
  const data = loadWorkspaceData();
  const initialLen = data.notes.length;
  data.notes = data.notes.filter((n) => n.id !== id);
  if (data.notes.length !== initialLen) {
    saveWorkspaceData(data);
    return true;
  }
  return false;
}

// ==========================================
// BACKUP EXPORT & IMPORT
// ==========================================

export function exportWorkspaceToJsonString(): string {
  const data = loadWorkspaceData();
  data.lastExportedAt = new Date().toISOString();
  saveWorkspaceData(data);
  return JSON.stringify(data, null, 2);
}

export function importWorkspaceFromJsonString(jsonString: string): { success: boolean; message: string; count?: number } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Invalid JSON format.' };
    }

    if (!Array.isArray(parsed.contents) && !Array.isArray(parsed.campaigns) && !Array.isArray(parsed.ideas)) {
      return { success: false, message: 'JSON does not contain recognized TapGrow workspace data.' };
    }

    const current = loadWorkspaceData();

    const mergedData: WorkspaceData = {
      schemaVersion: WORKSPACE_SCHEMA_VERSION,
      contents: Array.isArray(parsed.contents) ? parsed.contents : current.contents,
      campaigns: Array.isArray(parsed.campaigns) ? parsed.campaigns : current.campaigns,
      ideas: Array.isArray(parsed.ideas) ? parsed.ideas : current.ideas,
      notes: Array.isArray(parsed.notes) ? parsed.notes : current.notes,
      lastExportedAt: current.lastExportedAt,
    };

    saveWorkspaceData(mergedData);
    const totalItems =
      mergedData.contents.length +
      mergedData.campaigns.length +
      mergedData.ideas.length +
      mergedData.notes.length;

    return {
      success: true,
      message: `Successfully imported workspace with ${totalItems} total items.`,
      count: totalItems,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to import JSON: ${err?.message || 'Syntax error'}`,
    };
  }
}

// ==========================================
// INDIVIDUAL TEXT / MARKDOWN EXPORTS
// ==========================================

export function exportContentItemToText(item: ContentItem): string {
  return `# ${item.title}
*Platform:* ${item.platform.toUpperCase()}
*Format:* ${item.contentType.replace(/_/g, ' ').toUpperCase()}
*Status:* ${item.status.toUpperCase()}
${item.scheduledDate ? `*Scheduled Date:* ${item.scheduledDate}` : '*Scheduled Date:* Not set'}

---

## Caption
${item.caption}

---

## Call to Action
${item.callToAction || 'None specified'}

---

## Hashtags
${item.hashtags.map((h) => `#${h.replace(/^#/, '')}`).join(' ')}

${item.description ? `\n---\n\n## Internal Notes\n${item.description}` : ''}
`;
}

export function exportCampaignToText(campaign: Campaign): string {
  return `# Campaign: ${campaign.name}
*Status:* ${campaign.status.toUpperCase()}
*Channel:* ${campaign.marketingChannel}
*Duration:* ${campaign.startDate} to ${campaign.endDate || 'Ongoing'}
${campaign.budget ? `*Budget:* ${campaign.budget}` : ''}

---

## Objective
${campaign.objective}

---

## Description & Strategy
${campaign.description}

---

## Target Audience
${campaign.targetAudience}

${campaign.notes ? `\n---\n\n## Campaign Notes\n${campaign.notes}` : ''}
${campaign.userResults ? `\n---\n\n## User-Entered Results\n${campaign.userResults}` : ''}
`;
}

export function exportIdeaToText(idea: SavedIdea): string {
  return `# Idea: ${idea.title}
*Category:* ${idea.category.replace(/_/g, ' ').toUpperCase()}
*Saved on:* ${new Date(idea.createdAt).toLocaleDateString()}
${idea.tags.length > 0 ? `*Tags:* ${idea.tags.join(', ')}` : ''}

---

## Concept
${idea.description}
`;
}

export function exportNoteToText(note: MarketingNote): string {
  return `# ${note.title}
${note.category ? `*Category:* ${note.category}\n` : ''}*Last Updated:* ${new Date(note.updatedAt).toLocaleDateString()}
${note.tags.length > 0 ? `*Tags:* ${note.tags.join(', ')}\n` : ''}
---

${note.content}
`;
}
