import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildBusinessIntelligenceProfile } from '../recommendations/businessProfile';
import {
  getSuggestedQuestionsForProfile,
  generateLocalAdvisorResponse,
  generateStructuredMarketingStrategy,
} from './localAdvisorEngine';
import {
  loadAllConversations,
  createNewConversation,
  appendMessageToConversation,
  renameConversation,
  deleteConversation,
  saveMarketingStrategy,
  loadSavedStrategies,
} from '../../lib/advisorStorage';
import { AssessmentAnswers } from '../../types/assessment';
import { ChatMessage } from '../../types/advisor';

const mockAnswersCafe: AssessmentAnswers = {
  businessName: 'Coastal Roast Coffee',
  country: 'United States',
  cityArea: 'San Diego, CA',
  category: 'restaurant_cafe',
  businessModel: 'physical',
  hasWebsite: 'yes',
  websiteUrl: 'https://coastalroast.example.com',
  hasBusinessListing: 'yes',
  socialPresence: 'multiple',
  discoveryMethods: ['word_of_mouth', 'google_search'],
  contactConsistent: 'yes',
  askForReviews: 'yes',
  websiteDetailsClear: 'yes',
  publishesContent: 'yes',
  tracksMarketing: 'yes',
  clearConversionAction: 'yes',
  restaurantOnlineMenu: 'yes',
  mainGoal: 'more_visits',
  weeklyHours: '3_to_5h',
  budgetPreference: 'mostly_free',
};

const mockAnswersPlumber: AssessmentAnswers = {
  businessName: 'Apex Precision Plumbing',
  country: 'Canada',
  cityArea: 'Vancouver, BC',
  category: 'home_trades',
  businessModel: 'service_area',
  hasWebsite: 'no',
  hasBusinessListing: 'no',
  socialPresence: 'none',
  discoveryMethods: ['word_of_mouth'],
  contactConsistent: 'no',
  askForReviews: 'no',
  websiteDetailsClear: 'no',
  publishesContent: 'no',
  tracksMarketing: 'no',
  clearConversionAction: 'no',
  homeServiceAreaClarified: 'not_sure',
  homeServiceEmergencyOrQuoteForm: 'no',
  mainGoal: 'more_enquiries',
  weeklyHours: 'under_1h',
  budgetPreference: 'free_only',
};

describe('AI Marketing Advisor - localAdvisorEngine', () => {
  it('buildBusinessIntelligenceProfile produces structured intelligence profile from assessment answers', () => {
    const profile = buildBusinessIntelligenceProfile(mockAnswersCafe);
    assert.equal(profile.businessName, 'Coastal Roast Coffee');
    assert.equal(profile.category, 'restaurant_cafe');
    assert.equal(profile.categoryLabel, 'Restaurant & Cafe');
    assert.equal(profile.locationDisplay, 'San Diego, CA, United States');
    assert.ok(profile.verifiedStrengths.length > 0);
    assert.equal(profile.weeklyTime, '3_to_5h');
    assert.equal(profile.budgetPreference, 'mostly_free');
  });

  it('buildBusinessIntelligenceProfile identifies gaps for businesses without website or GBP', () => {
    const profile = buildBusinessIntelligenceProfile(mockAnswersPlumber);
    assert.equal(profile.businessName, 'Apex Precision Plumbing');
    assert.ok(profile.identifiedWeaknesses.some((w) => w.toLowerCase().includes('website')));
    assert.ok(profile.identifiedWeaknesses.some((w) => w.toLowerCase().includes('google')));
    assert.equal(profile.budgetPreference, 'free_only');
    assert.equal(profile.isZeroBudget, true);
  });

  it('getSuggestedQuestionsForProfile returns category-relevant marketing prompts', () => {
    const cafeProfile = buildBusinessIntelligenceProfile(mockAnswersCafe);
    const cafeQuestions = getSuggestedQuestionsForProfile(cafeProfile, mockAnswersCafe);
    assert.ok(cafeQuestions.length >= 2);
    const hasCategoryQuestion = cafeQuestions.some(
      (q) =>
        q.toLowerCase().includes('diners') ||
        q.toLowerCase().includes('google') ||
        q.toLowerCase().includes('menu') ||
        q.toLowerCase().includes('improve first')
    );
    assert.ok(hasCategoryQuestion, 'Expected cafe questions to mention hospitality terms');

    const tradeProfile = buildBusinessIntelligenceProfile(mockAnswersPlumber);
    const tradeQuestions = getSuggestedQuestionsForProfile(tradeProfile, mockAnswersPlumber);
    const hasTradeQuestion = tradeQuestions.some(
      (q) =>
        q.toLowerCase().includes('google') ||
        q.toLowerCase().includes('website') ||
        q.toLowerCase().includes('improve first') ||
        q.toLowerCase().includes('homeowner')
    );
    assert.ok(hasTradeQuestion, 'Expected trade questions to address trade foundations');
  });

  it('generateLocalAdvisorResponse returns 7-part structured response cards for marketing queries', () => {
    const profile = buildBusinessIntelligenceProfile(mockAnswersCafe);
    const result = generateLocalAdvisorResponse('What should I start with to improve first?', profile, mockAnswersCafe);

    assert.ok(result.text.length > 50);
    assert.ok(result.structuredAdvice, 'Expected structuredAdvice card');

    if (result.structuredAdvice) {
      assert.ok((result.structuredAdvice.understanding?.length ?? 0) > 0);
      assert.ok((result.structuredAdvice.observation?.length ?? 0) > 0);
      assert.ok((result.structuredAdvice.recommendedSolution?.length ?? 0) > 0);
      assert.ok(Array.isArray(result.structuredAdvice.stepByStep));
      assert.ok((result.structuredAdvice.stepByStep?.length ?? 0) >= 2);
      assert.ok((result.structuredAdvice.estimatedEffort?.length ?? 0) > 0);
      assert.ok((result.structuredAdvice.expectedBenefit?.length ?? 0) > 0);
      assert.ok((result.structuredAdvice.suggestedNextAction?.length ?? 0) > 0);
    }
  });

  it('generateLocalAdvisorResponse prioritizes organic foundation before recommending ads', () => {
    const profile = buildBusinessIntelligenceProfile(mockAnswersPlumber);
    const result = generateLocalAdvisorResponse('Should I spend money on Google ads or paid ads?', profile, mockAnswersPlumber);

    assert.ok(result.text.length > 0);
    const mentionsOrganicOrGoogle =
      result.text.toLowerCase().includes('google') ||
      result.text.toLowerCase().includes('organic') ||
      result.text.toLowerCase().includes('waste') ||
      result.text.toLowerCase().includes('foundation') ||
      result.text.toLowerCase().includes('website');
    assert.ok(mentionsOrganicOrGoogle, 'Advisor must emphasize foundational channels before paid ads');
  });

  it('generateStructuredMarketingStrategy produces complete 8-part strategy blueprint and Markdown', () => {
    const profile = buildBusinessIntelligenceProfile(mockAnswersCafe);
    const strategy = generateStructuredMarketingStrategy(profile, mockAnswersCafe);

    assert.equal(strategy.businessName, 'Coastal Roast Coffee');
    assert.equal(strategy.categoryLabel, 'Restaurant & Cafe');
    assert.ok(strategy.id.startsWith('strategy_'));
    assert.ok(strategy.businessOverview.points.length > 0);
    assert.ok(strategy.currentSituation.points.length > 0);
    assert.ok(strategy.mainOpportunities.points.length > 0);
    assert.ok(strategy.shortTermPriorities.points.length > 0);
    assert.ok(strategy.longTermObjectives.points.length > 0);
    assert.ok(strategy.recommendedChannels.points.length > 0);
    assert.ok(strategy.implementationSteps.points.length > 0);
    assert.ok(strategy.successMeasurements.points.length > 0);
    assert.ok(strategy.markdownContent.includes('# Coastal Roast Coffee — Local Marketing Growth Strategy'));
    assert.ok(strategy.markdownContent.includes('## 1. Business Overview & Positioning'));
    assert.ok(strategy.markdownContent.includes('## 8. Success Measurements & KPI Milestones'));
  });
});

describe('AI Marketing Advisor - advisorStorage', () => {
  it('creates, saves, appends messages, renames, and deletes conversations', () => {
    const newConv = createNewConversation('Test Boutique');
    assert.ok(newConv.id.startsWith('conv_'));
    assert.equal(newConv.messages.length, 0);

    const testMsg: ChatMessage = {
      id: 'msg_test_1',
      role: 'user',
      content: 'Can you help with local SEO?',
      timestamp: new Date().toISOString(),
    };

    const appended = appendMessageToConversation(newConv.id, testMsg);
    assert.ok(appended);
    assert.equal(appended?.messages.length, 1);

    const renamed = renameConversation(newConv.id, 'SEO Advice for Boutique');
    assert.equal(renamed?.title, 'SEO Advice for Boutique');

    const conversations = loadAllConversations();
    assert.ok(conversations.some((c) => c.id === newConv.id));

    deleteConversation(newConv.id);
    const afterDelete = loadAllConversations();
    assert.ok(!afterDelete.some((c) => c.id === newConv.id));
  });

  it('saves and retrieves marketing strategies in storage', () => {
    const profile = buildBusinessIntelligenceProfile(mockAnswersCafe);
    const strategy = generateStructuredMarketingStrategy(profile, mockAnswersCafe);

    saveMarketingStrategy(strategy);
    const savedList = loadSavedStrategies();
    assert.ok(savedList.length > 0);
    assert.equal(savedList[0].businessName, 'Coastal Roast Coffee');
  });
});
