import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadWorkspaceData,
  saveWorkspaceData,
  saveContentItem,
  duplicateContentItem,
  deleteContentItem,
  saveCampaign,
  deleteCampaign,
  saveIdea,
  toggleIdeaFavourite,
  deleteIdea,
  convertIdeaToContentDraft,
  convertIdeaToCampaign,
  saveNote,
  toggleNotePin,
  deleteNote,
  exportWorkspaceToJsonString,
  importWorkspaceFromJsonString,
  exportContentItemToText,
  exportCampaignToText,
  exportIdeaToText,
  exportNoteToText,
  generateStarterWorkspaceData,
} from '../../lib/workspaceStorage';
import { ContentItem, Campaign, SavedIdea, MarketingNote } from '../../types/workspace';

describe('TapGrow Marketing Workspace - Storage & Logic Unit Tests', () => {
  beforeEach(() => {
    // Reset workspace storage before each test
    const fresh = generateStarterWorkspaceData('Coastal Cafe', 'restaurant_cafe');
    saveWorkspaceData(fresh);
  });

  describe('Starter Packs & Business Personalization', () => {
    it('generates personalized starter pack for restaurants and cafes', () => {
      const data = generateStarterWorkspaceData('Artisan Roast', 'restaurant_cafe');
      assert.strictEqual(data.schemaVersion, 1);
      assert.ok(data.contents.length >= 2, 'Should generate starter content items');
      assert.ok(data.campaigns.length >= 1, 'Should generate starter campaign');
      assert.ok(data.ideas.length >= 1, 'Should generate starter ideas');
      assert.ok(data.notes.length >= 1, 'Should generate starter notes');

      // Check restaurant-specific keywords
      const hasFoodIdea = data.ideas.some((i) => i.title.toLowerCase().includes('chef') || i.title.toLowerCase().includes('special') || i.description.toLowerCase().includes('ingredients'));
      assert.ok(hasFoodIdea, 'Expected restaurant-specific ideas in starter pack');
    });

    it('generates personalized starter pack for home trades & service contractors', () => {
      const data = generateStarterWorkspaceData('Apex Plumbing', 'home_trades');
      assert.ok(data.contents.length >= 2);
      const hasTradeIdea = data.ideas.some((i) => i.title.toLowerCase().includes('homeowner') || i.tags.includes('homeowner_tips') || i.tags.includes('service_area'));
      assert.ok(hasTradeIdea, 'Expected trade-specific ideas in starter pack');
    });

    it('generates personalized starter pack for salon & wellness', () => {
      const data = generateStarterWorkspaceData('Glow Studio', 'salon_wellness');
      assert.ok(data.ideas.some((i) => i.title.toLowerCase().includes('transformation') || i.tags.includes('transformation')));
    });

    it('generates sensible defaults for general categories', () => {
      const data = generateStarterWorkspaceData('Summit Solutions', 'other_local');
      assert.ok(data.contents.length > 0);
      assert.ok(data.campaigns.length > 0);
      assert.ok(data.ideas.length > 0);
    });
  });

  describe('Content Planner Operations', () => {
    it('creates, saves, and updates a content item', () => {
      const initial = loadWorkspaceData();
      const initialCount = initial.contents.length;

      const newItem: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Weekend Flash Sale Announcement',
        platform: 'instagram',
        contentType: 'carousel',
        caption: 'Get 20% off all artisan beans this weekend only! Link in bio.',
        hashtags: ['coffee', 'localroast', 'specialtycoffee'],
        callToAction: 'Visit us this Saturday & Sunday',
        scheduledDate: '2026-11-08',
        status: 'draft',
      };

      const saved = saveContentItem(newItem);
      assert.ok(saved.id, 'Should assign a unique id');
      assert.strictEqual(saved.title, 'Weekend Flash Sale Announcement');
      assert.strictEqual(saved.status, 'draft');

      const afterCreate = loadWorkspaceData();
      assert.strictEqual(afterCreate.contents.length, initialCount + 1);

      // Now update the content item
      const updated = saveContentItem({
        ...saved,
        status: 'ready',
        caption: 'Updated caption with exciting giveaway details!',
      });

      assert.strictEqual(updated.id, saved.id);
      assert.strictEqual(updated.status, 'ready');

      const afterUpdate = loadWorkspaceData();
      const reloaded = afterUpdate.contents.find((c) => c.id === saved.id);
      assert.ok(reloaded);
      assert.strictEqual(reloaded.caption, 'Updated caption with exciting giveaway details!');
    });

    it('duplicates a content item with (Copy) title and resets status to draft', () => {
      const initial = loadWorkspaceData();
      const itemToDuplicate = initial.contents[0];
      assert.ok(itemToDuplicate, 'Should have at least 1 item to duplicate');

      const duplicate = duplicateContentItem(itemToDuplicate.id);
      assert.ok(duplicate, 'Duplicate should succeed');
      assert.notStrictEqual(duplicate.id, itemToDuplicate.id);
      assert.strictEqual(duplicate.title, `${itemToDuplicate.title} (Copy)`);
      assert.strictEqual(duplicate.status, 'draft');

      const updated = loadWorkspaceData();
      assert.strictEqual(updated.contents.length, initial.contents.length + 1);
    });

    it('deletes a content item', () => {
      const initial = loadWorkspaceData();
      const itemToDelete = initial.contents[0];
      assert.ok(itemToDelete);

      const success = deleteContentItem(itemToDelete.id);
      assert.strictEqual(success, true);

      const afterDelete = loadWorkspaceData();
      assert.strictEqual(afterDelete.contents.length, initial.contents.length - 1);
      assert.strictEqual(afterDelete.contents.some((c) => c.id === itemToDelete.id), false);
    });
  });

  describe('Campaign Manager Operations', () => {
    it('creates and tracks campaigns with user-entered results and status', () => {
      const initial = loadWorkspaceData();
      const initialCount = initial.campaigns.length;

      const newCampaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Spring Tasting Festival Promotion',
        objective: 'Drive 50 new walk-in customers',
        description: 'Multi-week local social and flyer campaign to promote seasonal tasting flights.',
        targetAudience: 'Local residents within 5 miles',
        marketingChannel: 'Instagram + Google Business Profile',
        startDate: '2026-04-01',
        endDate: '2026-04-30',
        budget: '$100',
        status: 'active',
        userResults: 'Week 1: 18 flights served to first-time guests.',
      };

      const saved = saveCampaign(newCampaign);
      assert.ok(saved.id);
      assert.strictEqual(saved.name, 'Spring Tasting Festival Promotion');
      assert.strictEqual(saved.status, 'active');

      const updatedData = loadWorkspaceData();
      assert.strictEqual(updatedData.campaigns.length, initialCount + 1);

      // Delete campaign
      const deleted = deleteCampaign(saved.id);
      assert.strictEqual(deleted, true);

      const afterDelete = loadWorkspaceData();
      assert.strictEqual(afterDelete.campaigns.length, initialCount);
    });
  });

  describe('Ideas Library Operations & Conversions', () => {
    it('saves ideas and toggles favourite status', () => {
      const initial = loadWorkspaceData();
      const newIdea: Omit<SavedIdea, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Customer of the Month Spotlight',
        description: 'Highlight a loyal regular on Instagram stories and award a free latte.',
        category: 'customer_engagement',
        tags: ['community', 'stories', 'loyalty'],
        isFavourite: false,
      };

      const saved = saveIdea(newIdea);
      assert.ok(saved.id);
      assert.strictEqual(saved.isFavourite, false);

      const toggled = toggleIdeaFavourite(saved.id);
      assert.ok(toggled);
      assert.strictEqual(toggled?.isFavourite, true);

      const afterToggle = loadWorkspaceData();
      const item = afterToggle.ideas.find((i) => i.id === saved.id);
      assert.ok(item);
      assert.strictEqual(item.isFavourite, true);

      // Clean up
      deleteIdea(saved.id);
    });

    it('converts an idea into a Content Draft', () => {
      const savedIdea = saveIdea({
        title: 'Morning Routine Behind The Scenes',
        description: 'Show how our barista calibrates espresso grinders every morning at 6 AM.',
        category: 'social_media',
        tags: ['bts', 'coffee', 'craft'],
        isFavourite: true,
      });

      const draft = convertIdeaToContentDraft(savedIdea.id);
      assert.ok(draft);
      assert.ok(draft.id);
      assert.strictEqual(draft.title, savedIdea.title);
      assert.strictEqual(draft.status, 'draft');
      assert.ok(draft.caption.includes('calibrates espresso grinders'));
      assert.ok(draft.hashtags.includes('bts'));

      const loaded = loadWorkspaceData();
      assert.ok(loaded.contents.some((c) => c.id === draft.id));
    });

    it('converts an idea into a Campaign', () => {
      const savedIdea = saveIdea({
        title: 'Local Neighborhood Loyalty Month',
        description: 'Offer stamp cards with double stamps on Tuesdays throughout November.',
        category: 'campaign_ideas',
        tags: ['loyalty', 'promotion'],
        isFavourite: true,
      });

      const campaign = convertIdeaToCampaign(savedIdea.id);
      assert.ok(campaign);
      assert.ok(campaign.id);
      assert.strictEqual(campaign.name, savedIdea.title);
      assert.strictEqual(campaign.status, 'planning');
      assert.ok(campaign.description.includes(savedIdea.description));

      const loaded = loadWorkspaceData();
      assert.ok(loaded.campaigns.some((c) => c.id === campaign.id));
    });
  });

  describe('Marketing Notes Operations', () => {
    it('creates, saves, pins, and updates notes', () => {
      const initial = loadWorkspaceData();
      const initialCount = initial.notes.length;

      const newNote: Omit<MarketingNote, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Brand Tone Guidelines',
        content: 'Warm, knowledgeable, welcoming, locally grounded. Never use corporate jargon.',
        category: 'branding',
        tags: ['voice', 'guidelines'],
        isPinned: false,
      };

      const saved = saveNote(newNote);
      assert.ok(saved.id);
      assert.strictEqual(saved.isPinned, false);

      const pinned = toggleNotePin(saved.id);
      assert.ok(pinned);
      assert.strictEqual(pinned?.isPinned, true);

      const afterPin = loadWorkspaceData();
      const updatedNote = afterPin.notes.find((n) => n.id === saved.id);
      assert.ok(updatedNote);
      assert.strictEqual(updatedNote.isPinned, true);

      deleteNote(saved.id);
      const afterDelete = loadWorkspaceData();
      assert.strictEqual(afterDelete.notes.length, initialCount);
    });
  });

  describe('JSON Export and Import Backup Protection', () => {
    it('exports valid workspace JSON structure with schemaVersion', () => {
      const jsonString = exportWorkspaceToJsonString();
      assert.ok(jsonString.length > 50);

      const parsed = JSON.parse(jsonString);
      assert.strictEqual(parsed.schemaVersion, 1);
      assert.ok(Array.isArray(parsed.contents));
      assert.ok(Array.isArray(parsed.campaigns));
      assert.ok(Array.isArray(parsed.ideas));
      assert.ok(Array.isArray(parsed.notes));
    });

    it('rejects malformed or invalid JSON imports gracefully', () => {
      const resultEmpty = importWorkspaceFromJsonString('');
      assert.strictEqual(resultEmpty.success, false);

      const resultInvalid = importWorkspaceFromJsonString('{"broken": true}');
      assert.strictEqual(resultInvalid.success, false);
      assert.ok(resultInvalid.message);
    });

    it('successfully imports valid JSON backup', () => {
      const backupPayload = JSON.stringify({
        schemaVersion: 1,
        contents: [
          {
            id: 'backup-item-1',
            title: 'Imported Post',
            platform: 'instagram',
            contentType: 'image_post',
            caption: 'Imported test caption',
            hashtags: ['test'],
            status: 'draft',
            createdAt: '2026-11-01T00:00:00Z',
            updatedAt: '2026-11-01T00:00:00Z',
          },
        ],
        campaigns: [],
        ideas: [],
        notes: [],
      });

      const importResult = importWorkspaceFromJsonString(backupPayload);
      assert.strictEqual(importResult.success, true);

      const current = loadWorkspaceData();
      assert.strictEqual(current.contents.some((c) => c.id === 'backup-item-1'), true);
    });
  });

  describe('Markdown & Plain Text Export Helpers', () => {
    it('formats Content Item to text accurately', () => {
      const item: ContentItem = {
        id: 'test-1',
        title: 'Weekly Special',
        platform: 'instagram',
        contentType: 'reel',
        caption: 'Come taste our cinnamon latte!',
        hashtags: ['coffee', 'specialty'],
        callToAction: 'Order ahead online',
        scheduledDate: '2026-11-10',
        status: 'ready',
        createdAt: '2026-11-01T00:00:00Z',
        updatedAt: '2026-11-01T00:00:00Z',
      };

      const md = exportContentItemToText(item);
      assert.ok(md.includes('# Weekly Special'));
      assert.ok(md.includes('INSTAGRAM'));
      assert.ok(md.includes('READY'));
      assert.ok(md.includes('Come taste our cinnamon latte!'));
      assert.ok(md.includes('#coffee #specialty'));
    });

    it('formats Campaign to text accurately', () => {
      const campaign: Campaign = {
        id: 'camp-1',
        name: 'Grand Reopening',
        objective: 'Drive 200 visits',
        description: 'Celebrate our newly renovated patio',
        targetAudience: 'Locals in 3-mile radius',
        marketingChannel: 'Instagram & Local Flyers',
        startDate: '2026-12-01',
        budget: '$150',
        status: 'active',
        userResults: '50 RSVPs received so far.',
        createdAt: '2026-11-01T00:00:00Z',
        updatedAt: '2026-11-01T00:00:00Z',
      };

      const md = exportCampaignToText(campaign);
      assert.ok(md.includes('# Campaign: Grand Reopening'));
      assert.ok(md.includes('Drive 200 visits'));
      assert.ok(md.includes('Celebrate our newly renovated patio'));
      assert.ok(md.includes('50 RSVPs received so far.'));
    });

    it('formats Idea to text accurately', () => {
      const idea: SavedIdea = {
        id: 'idea-1',
        title: 'Secret Menu Item Teaser',
        description: 'Post a mystery photo of an off-menu pastry.',
        category: 'social_media',
        tags: ['teaser', 'engagement'],
        isFavourite: true,
        createdAt: '2026-11-01T00:00:00Z',
        updatedAt: '2026-11-01T00:00:00Z',
      };

      const md = exportIdeaToText(idea);
      assert.ok(md.includes('# Idea: Secret Menu Item Teaser'));
      assert.ok(md.includes('SOCIAL MEDIA'));
      assert.ok(md.includes('Post a mystery photo'));
    });

    it('formats Note to text accurately', () => {
      const note: MarketingNote = {
        id: 'note-1',
        title: 'Weekly Content Cadence',
        content: 'Monday: Motivational quote\nWednesday: Product tip\nFriday: Customer story',
        category: 'strategy',
        tags: ['cadence', 'routine'],
        isPinned: true,
        createdAt: '2026-11-01T00:00:00Z',
        updatedAt: '2026-11-01T00:00:00Z',
      };

      const md = exportNoteToText(note);
      assert.ok(md.includes('# Weekly Content Cadence'));
      assert.ok(md.includes('Monday: Motivational quote'));
    });
  });
});
