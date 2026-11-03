import { AssessmentAnswers } from '../../types/assessment';
import { BusinessIntelligenceProfile } from '../recommendations/businessProfile';
import {
  ChatMessage,
  StructuredAdviceSection,
  GeneratedMarketingStrategy,
} from '../../types/advisor';

/**
 * Returns dynamic, profile-specific suggested questions.
 */
export function getSuggestedQuestionsForProfile(
  profile: BusinessIntelligenceProfile,
  answers: AssessmentAnswers
): string[] {
  const suggestions: string[] = [];

  // Goal & general prioritization
  suggestions.push(`What is the #1 thing ${profile.businessName} should improve first?`);

  // Category-specific high-leverage prompts
  switch (profile.category) {
    case 'restaurant_cafe':
      suggestions.push('How can we attract more local diners on slow mid-week evenings?');
      suggestions.push('What are the best practices for our Google Business Profile menu?');
      break;
    case 'salon_wellness':
      suggestions.push('How can I get salon clients to rebook their next appointment before leaving?');
      suggestions.push('Give me 4 local Instagram Reel & photo concepts for our services.');
      break;
    case 'health_clinic':
      suggestions.push('How can our website clearly explain the new patient booking process?');
      suggestions.push('How do we ethically gather 5-star patient reviews without violating privacy?');
      break;
    case 'home_trades':
      suggestions.push('How do I rank in Google Maps for surrounding service suburbs?');
      suggestions.push('How can I turn urgent homeowner calls into booked quote appointments?');
      break;
    case 'retail':
      suggestions.push('How can I drive more local foot traffic from people searching nearby on phones?');
      suggestions.push('How should an independent shop highlight in-store inventory online?');
      break;
    case 'professional_services':
      suggestions.push('How can we convert website visitors into initial consultation inquiries?');
      suggestions.push('What is the best local B2B referral strategy for our services?');
      break;
    case 'fitness':
      suggestions.push('How can we structure an introductory pass that converts into monthly memberships?');
      suggestions.push('What member referral incentives work best for local fitness studios?');
      break;
    default:
      suggestions.push(`How can I get more local customers in ${profile.locationDisplay || 'my city'}?`);
      break;
  }

  // Deficit-specific suggestions
  if (!profile.hasWebsite) {
    suggestions.push('How should I plan and launch a simple, high-converting one-page website?');
  } else if (answers.clearConversionAction !== 'yes') {
    suggestions.push('How do I optimize the primary Call to Action (CTA) on my homepage?');
  }

  if (profile.isGoogleListingMissingOrUnknown) {
    suggestions.push('Step-by-step: How do I claim and verify my Google Business Profile?');
  } else if (!profile.isActivelyCollectingReviews) {
    suggestions.push('What is an honest, non-spammy script to ask clients for Google reviews?');
  }

  // Social / Content suggestion
  if (profile.socialPresence !== 'none') {
    suggestions.push('Give me a 30-day, low-stress social media content rhythm.');
  }

  return suggestions.slice(0, 5);
}

/**
 * Deterministic consultation advisor logic for local small business owners.
 * Synthesizes business category, location, verified foundations, and primary goals.
 */
export function generateLocalAdvisorResponse(
  userQuery: string,
  profile: BusinessIntelligenceProfile,
  answers: AssessmentAnswers,
  conversationHistory: ChatMessage[] = []
): { text: string; structuredAdvice?: StructuredAdviceSection } {
  const query = userQuery.toLowerCase().trim();
  const bizName = profile.businessName;
  const categoryName = profile.categoryLabel;
  const location = profile.locationDisplay || 'your local area';

  // 1. Topic: What to improve first / Top priorities
  if (
    query.includes('first') ||
    query.includes('start') ||
    query.includes('top priorit') ||
    query.includes('where do i begin')
  ) {
    const topGap = profile.identifiedWeaknesses[0] || 'establishing consistent customer review collection';
    return {
      text: `Based on your TapGrow assessment for **${bizName}** (${categoryName} in ${location}), your highest-leverage starting point is addressing: **${topGap}**.

Because your stated goal is **${profile.primaryGoal.replace(/_/g, ' ')}**, fixing this discovery bottleneck will immediately stop potential customers from bouncing to nearby competitors before you spend time on secondary marketing channels.`,
      structuredAdvice: {
        understanding: `You want to know where to focus your marketing effort for maximum immediate return without getting overwhelmed.`,
        observation: `For ${categoryName} businesses in ${location}, prospects make split-second decisions based on Google map visibility, clear contact options, and recent reviews. Currently, your profile indicates: ${topGap}.`,
        recommendedSolution: `Establish your core visibility foundation first before testing paid ads or complex campaigns.`,
        stepByStep: [
          profile.isGoogleListingMissingOrUnknown
            ? 'Claim and verify your Google Business Profile with accurate category, hours, and photos.'
            : 'Audit your existing Google profile hours and ensure contact info matches your website.',
          profile.hasWebsite
            ? 'Ensure your homepage has a prominent, 1-tap phone dialer or booking link above the fold.'
            : 'Plan a lightweight 1-page mobile-friendly website highlighting your core offerings and location.',
          'Draft a friendly 2-sentence review request template to send to your next 3 satisfied clients.',
        ],
        estimatedEffort: profile.weeklyTime === 'under_1h' ? '30–45 mins this week' : '1–2 hours this week',
        expectedBenefit: `Direct increase in phone inquiries, driving directions, and customer confidence.`,
        suggestedNextAction: `Open the Action Checklist on your dashboard and complete your top-ranked action item.`,
      },
    };
  }

  // 2. Topic: Reviews & Reputation
  if (
    query.includes('review') ||
    query.includes('rating') ||
    query.includes('reputation') ||
    query.includes('feedback') ||
    query.includes('testimonial')
  ) {
    return {
      text: `Customer reviews are the single most influential conversion factor for ${categoryName} businesses. In ${location}, customers filter search results by 4.5+ stars and recent review dates.

Here is an honest, policy-compliant approach to build your review velocity without friction.`,
      structuredAdvice: {
        understanding: `You need a reliable, compliant way to collect authentic 5-star customer reviews on Google regularly.`,
        observation: profile.isActivelyCollectingReviews
          ? `You already ask for reviews, which puts you ahead of 60% of local competitors. The focus now is automating the timing and replying to every review.`
          : `Your assessment indicated you do not currently have a systematic habit of asking satisfied clients for reviews right after service.`,
        recommendedSolution: `Implement the "Post-Service 10-Minute Review Request Habit" using your direct Google short-link.`,
        stepByStep: [
          'Generate your direct review link from your Google Business Profile dashboard ("Ask for reviews").',
          'Save this SMS/WhatsApp template in your phone keyboard shortcuts: "Hi [Name], thank you for visiting ${bizName} today! If you had a great experience, could you take 30 seconds to leave us an honest Google review? [Link] It helps our local business tremendously!"',
          'Send the link within 15–30 minutes of completing service while the positive experience is fresh.',
          'Never offer discounts, free gifts, or incentives in exchange for reviews (this violates Google policies).',
          'Reply politely to all reviews within 48 hours to signal active ownership.',
        ],
        estimatedEffort: '20 minutes setup + 2 minutes per customer',
        expectedBenefit: `Higher Google map pack rankings, increased click-through rate, and instant trust from skeptical new prospects.`,
        suggestedNextAction: `Select 3 past happy clients from the last 14 days and send them your polite personal review link today.`,
      },
    };
  }

  // 3. Topic: Local SEO & Google Business Profile
  if (
    query.includes('local seo') ||
    query.includes('google business') ||
    query.includes('maps') ||
    query.includes('map pack') ||
    query.includes('ranking') ||
    query.includes('rank')
  ) {
    return {
      text: `Local SEO for **${bizName}** revolves around three primary Google signals: **Relevance** (exact category and keywords), **Distance** (proximity to the searcher in ${location}), and **Prominence** (review count, photos, citations, and website authority).`,
      structuredAdvice: {
        understanding: `You want ${bizName} to appear in the top 3 Google Map results when local searchers look for ${categoryName} services nearby.`,
        observation: profile.isGoogleListingMissingOrUnknown
          ? `Your business listing is currently unverified or missing, which prevents Google from showing you in the local map pack.`
          : `Your Google profile exists. To outrank local competitors, optimize category precision, upload weekly photos, and maintain NAP directory consistency.`,
        recommendedSolution: `Complete 100% of your Google Business Profile attributes and align your name, address, and phone number across the web.`,
        stepByStep: [
          'Choose the single most precise primary category in Google Business Profile.',
          'Fill in specific secondary categories that describe your specializations.',
          'Upload 5–10 bright, real photos of your team, storefront, and completed work.',
          'Audit your Name, Address, and Phone (NAP) on Apple Maps, Bing Places, and Facebook to ensure character-for-character consistency.',
          'Publish a Google Update (Post) once every two weeks announcing a seasonal tip, dish, or service highlight.',
        ],
        estimatedEffort: '45–60 minutes',
        expectedBenefit: `Appear in high-intent "near me" searches on smartphones throughout ${location}.`,
        suggestedNextAction: `Check your primary category in Google Business Profile to ensure it is the most specific match possible.`,
      },
    };
  }

  // 4. Topic: Website Improvements & Conversion
  if (
    query.includes('website') ||
    query.includes('homepage') ||
    query.includes('cta') ||
    query.includes('call to action') ||
    query.includes('conversion') ||
    query.includes('bounce')
  ) {
    if (!profile.hasWebsite) {
      return {
        text: `**${bizName}** does not currently have an active website. For a ${categoryName} in ${location}, an owned website provides search engines with full context on your services and gives visitors a 24/7 destination to book or call.`,
        structuredAdvice: {
          understanding: `You need a digital storefront that establishes credibility without spending thousands on unnecessary complex web development.`,
          observation: `Relying solely on social media platforms leaves your business vulnerable to algorithm changes and search invisibility.`,
          recommendedSolution: `Build a clean, lightning-fast 1-page business website focusing solely on service clarity, local coverage, and 1-tap contact.`,
          stepByStep: [
            'Create a bold headline above the fold: [What you do] for clients in [City/Neighborhood].',
            'List your top 3–5 core services with clear starting pricing or consultation details.',
            'Embed a 1-tap clickable telephone button (`tel:...`) and appointment or quote form.',
            'Display your verified street address or explicit service radius with regular operating hours.',
            'Include 3 real customer testimonials with reviewer first names and neighborhood.',
          ],
          estimatedEffort: '1–2 hours',
          expectedBenefit: `Direct destination for search traffic and higher conversion rate from mobile searchers.`,
          suggestedNextAction: `Draft your 1-line homepage headline and service bullet points using the Website Planning task in your dashboard.`,
        },
      };
    }

    return {
      text: `Optimizing your website for **${bizName}** is about eliminating friction so visitors convert into phone calls or booked appointments within 5 seconds of loading your page.`,
      structuredAdvice: {
        understanding: `You want more website visitors to actually pick up the phone, submit inquiries, or schedule appointments.`,
        observation: `Most local websites fail because the headline is vague, phone numbers are buried in footers, or pages take over 3 seconds to load on mobile data.`,
        recommendedSolution: `Implement the "5-Second Clarity & Sticky CTA" framework.`,
        stepByStep: [
          'Add a sticky or prominent primary CTA button in your website header: "Call Now", "Book Appointment", or "Request Quote".',
          'State your exact service area or location in the first 2 sentences of the homepage.',
          'Replace generic stock imagery with authentic photos of your actual team and workspace.',
          'Add an FAQ section addressing the top 3 pricing and preparation questions clients ask before buying.',
          'Test loading your site on a phone on 4G cellular connection to verify buttons are easy to tap with one thumb.',
        ],
        estimatedEffort: '30–45 minutes',
        expectedBenefit: `Immediate 20–35% lift in inquiry conversion from existing visitors.`,
        suggestedNextAction: `Perform the 5-second test: ask someone to look at your site for 5 seconds and tell you what you do and where you are located.`,
      },
    };
  }

  // 5. Topic: Social Media & Content Ideas
  if (
    query.includes('social') ||
    query.includes('instagram') ||
    query.includes('facebook') ||
    query.includes('reel') ||
    query.includes('post') ||
    query.includes('tiktok') ||
    query.includes('content')
  ) {
    const postThemes = getCategorySocialThemes(profile.category, bizName);

    return {
      text: `For a local ${categoryName} in ${location}, social media should focus on **authenticity, local familiarity, and visual proof** rather than trying to become a global influencer. Consistent, low-stress posting once or twice a week is significantly more effective than burning out.`,
      structuredAdvice: {
        understanding: `You want practical social media content ideas that attract local clients without eating up hours of your weekly schedule.`,
        observation: `Local customers want to see the real humans behind ${bizName}, high-quality results, and proof of care.`,
        recommendedSolution: `Adopt a 4-pillar recurring monthly content rhythm: Proof, Behind-the-Scenes, Helpful Tip, and Community Spotlight.`,
        stepByStep: [
          `Post Idea 1 (Before & After / Finished Result): ${postThemes.proof}`,
          `Post Idea 2 (Behind-the-Scenes / Team at Work): ${postThemes.behindScenes}`,
          `Post Idea 3 (Expert Tip / Answering Common Doubt): ${postThemes.tip}`,
          `Post Idea 4 (Local Community / Customer Appreciation): ${postThemes.community}`,
          'Always geotag your specific neighborhood or town on Instagram and Facebook.',
          'Include a clear call to action in captions: "Link in bio to check availability or call [phone]."',
        ],
        estimatedEffort: '30–45 minutes once a week (or batch 4 posts in 1 hour monthly)',
        expectedBenefit: `Top-of-mind brand recall with past clients and organic word-of-mouth shares.`,
        suggestedNextAction: `Take 2 real photos during your normal workday today to schedule for your next post.`,
      },
    };
  }

  // 6. Topic: Customer Retention & Repeat Business
  if (
    query.includes('retention') ||
    query.includes('repeat') ||
    query.includes('loyalty') ||
    query.includes('churn') ||
    query.includes('regular')
  ) {
    return {
      text: `Acquiring a new customer costs 5x to 7x more than retaining an existing one. For **${bizName}**, increasing customer retention by just 5% can increase overall profitability by 25%+.`,
      structuredAdvice: {
        understanding: `You want existing customers to return more frequently and recommend your business to friends and colleagues.`,
        observation: `Most local businesses lose past clients not because of bad service, but simply because life gets busy and the business never follows up.`,
        recommendedSolution: `Establish a systematic post-transaction check-in cadence.`,
        stepByStep: [
          'Send a warm follow-up message 3–7 days after service asking how everything is performing.',
          'Create a seasonal rebooking trigger (e.g. 6-week salon reminder, seasonal HVAC maintenance check, dining birthday special).',
          'Implement a simple, zero-tech referral buddy perk ("Refer a neighbor and you both receive $20 credit").',
          'Keep a lightweight VIP customer list for early access to specials or off-peak booking slots.',
        ],
        estimatedEffort: '30 minutes to set up',
        expectedBenefit: `Predictable recurring cash flow and reduced reliance on paid customer acquisition.`,
        suggestedNextAction: `Identify 5 loyal clients from last month and send them a genuine note of appreciation this afternoon.`,
      },
    };
  }

  // 7. Topic: Paid Advertising / Google Ads / Meta Ads
  if (
    query.includes('ad') ||
    query.includes('paid') ||
    query.includes('google ads') ||
    query.includes('facebook ads') ||
    query.includes('meta ads') ||
    query.includes('sponsor')
  ) {
    return {
      text: `Paid advertising can accelerate growth, but running ads before your Google profile, website conversion CTA, and reviews are in place is like pouring water into a leaky bucket.

Here is the honest guidance on when and how **${bizName}** should consider paid marketing:`,
      structuredAdvice: {
        understanding: `You want to know if and how paid ads can deliver profitable new customer acquisition for your business.`,
        observation: profile.isZeroBudget
          ? `Your assessment indicated a preference for free organic marketing. Do not feel pressured into paid ads; 80%+ of local discovery can be achieved organically via Google Maps and reviews.`
          : `If you have budget to invest, prioritize high-intent Google search ads or Google Local Services Ads over generic social media boost buttons.`,
        recommendedSolution: `Maximize organic conversion foundations first, then test Google Local Services Ads (Google Guaranteed) or tight-radius search ads.`,
        stepByStep: [
          'Fix all organic conversion gaps first: ensure phone calls are answered promptly and landing page loads in < 2 seconds.',
          'Avoid clicking generic "Boost Post" buttons on Facebook or Instagram without a dedicated landing page.',
          'If you are a home service or trades business, apply for Google Local Services Ads (Google Guaranteed) where you pay per lead rather than per click.',
          'Set a tight geographical radius (e.g., 5–10 miles from your shop or service territory).',
          'Track every lead source in your inquiry log to ensure ad spend yields profitable return on investment.',
        ],
        estimatedEffort: '1 hour setup, 15 minutes weekly monitoring',
        expectedBenefit: `High-intent inbound leads from prospects actively searching for your service right now.`,
        suggestedNextAction: `Make sure your website primary CTA and phone tracking log are active before spending any ad dollars.`,
      },
    };
  }

  // Default / Open Marketing Advisory Guidance
  return {
    text: `Hello! I am your TapGrow Marketing Advisor, personalized for **${bizName}** (${categoryName} in ${location}).

Based on your business profile, your primary focus is **${profile.primaryGoal.replace(/_/g, ' ')}**, working within **${profile.weeklyTime.replace(/_/g, ' ')}** weekly marketing capacity and **${profile.budgetPreference.replace(/_/g, ' ')}** budget preference.

I can guide you on:
- **Local SEO & Google Business Profile**: Ranking in local map searches and dominating "near me" mobile queries.
- **Website & Conversion Optimization**: Turning casual page visitors into phone calls and booked appointments.
- **Customer Reviews & Reputation**: Reliable, policy-compliant routines to steadily collect 5-star Google feedback.
- **Social Media Content**: 4-week batching rhythms, local photo hooks, and neighborhood community engagement.
- **Customer Acquisition & Retention**: Turning first-time buyers into loyal recurring regulars.

What specific marketing challenge would you like to solve today? You can choose one of the suggested questions above, ask about any specific channel, or click **"Generate My Marketing Strategy"** for a complete 8-part roadmap.`,
  };
}

function getCategorySocialThemes(category: string, bizName: string) {
  switch (category) {
    case 'restaurant_cafe':
      return {
        proof: 'Close-up slow-motion video of your signature dish being plated or sliced with natural window light.',
        behindScenes: 'Morning kitchen prep: the chef chopping fresh local ingredients or pulling espresso shots.',
        tip: 'Pairing recommendation: which drink perfectly complements your most popular entree.',
        community: 'Photo of your smiling front-of-house team welcoming the weekend dinner crowd.',
      };
    case 'salon_wellness':
      return {
        proof: 'Split before-and-after photo showing hair transformation, nail art, or radiant skincare glow.',
        behindScenes: 'Organizing treatment tools, fresh towels, and luxury product lines in the studio.',
        tip: 'At-home maintenance advice: how clients can preserve their color or skin hydration between visits.',
        community: 'Client appreciation shout-out celebrating a regular client milestone.',
      };
    case 'home_trades':
      return {
        proof: 'Side-by-side photo of the broken pipe, damaged roof, or dated electrical panel vs the clean, finished repair.',
        behindScenes: 'Tool truck tour: showing the specialized equipment used to solve tough neighborhood trade problems.',
        tip: 'Homeowner preventive check: how to spot a minor water leak or electrical issue before it becomes an emergency.',
        community: 'Working on a local landmark or neighbor’s home in a specific suburb.',
      };
    case 'health_clinic':
      return {
        proof: 'Infographic explaining the treatment roadmap for a common discomfort or clinical condition.',
        behindScenes: 'Tour of our clean, welcoming therapy room and sterilized clinical setup.',
        tip: '30-second ergonomics or posture stretch that local desk workers can do right at their chair.',
        community: 'Introduction to attending clinical staff member and their accredited qualifications.',
      };
    case 'retail':
      return {
        proof: 'Top 3 newly arrived seasonal items displayed on a styled wooden counter.',
        behindScenes: 'Unboxing fresh inventory boxes or hand-arranging store window displays.',
        tip: 'How to care for or select the right product for different needs.',
        community: 'Friendly neighborhood greeting highlighting nearby weekend events or markets.',
      };
    case 'fitness':
      return {
        proof: 'Member achievement highlight celebrating 50 attended workouts or form improvement.',
        behindScenes: 'Coaches demoing workout movement standards and setup before class starts.',
        tip: 'Hydration and post-workout recovery tips for busy everyday athletes.',
        community: 'High-five group photo from Saturday morning team class.',
      };
    default:
      return {
        proof: 'Photo of a finished project or delighted customer holding their completed order.',
        behindScenes: 'Behind the scenes at our workspace preparing for the week ahead.',
        tip: 'Top answer to the #1 question our customers ask before doing business with us.',
        community: 'Thanking our local community for supporting small businesses on our block.',
      };
  }
}

/**
 * Generates an 8-part structured marketing strategy based strictly on the saved business profile.
 */
export function generateStructuredMarketingStrategy(
  profile: BusinessIntelligenceProfile,
  answers: AssessmentAnswers
): GeneratedMarketingStrategy {
  const id = `strategy_${Date.now()}`;
  const now = new Date().toISOString();
  const bizName = profile.businessName;
  const categoryLabel = profile.categoryLabel;
  const location = profile.locationDisplay || 'local service area';
  const goalLabel = profile.primaryGoal.replace(/_/g, ' ');
  const timeLabel = profile.weeklyTime.replace(/_/g, ' ');
  const budgetLabel = profile.budgetPreference.replace(/_/g, ' ');

  // 1. Business Overview
  const businessOverview = {
    title: '1. Business Overview & Positioning',
    summary: `${bizName} is an established ${categoryLabel} based in ${location}, operating under a ${profile.businessModel.replace(/_/g, ' ')} model.`,
    points: [
      `Primary Business Objective: ${goalLabel.toUpperCase()}`,
      `Operating Territory: ${location}`,
      `Current Digital Footprint: ${profile.hasWebsite ? 'Active Website' : 'No Dedicated Website'}, ${profile.isGoogleListingVerified ? 'Verified Google Business Profile' : 'Unverified/Missing Google Listing'}`,
      `Dedicated Operational Capacity: ${timeLabel} per week dedicated to marketing execution`,
      `Budget Allocation Preference: ${budgetLabel}`,
    ],
  };

  // 2. Current Marketing Situation
  const currentSituation = {
    title: '2. Current Marketing Situation & Diagnostic',
    summary: `Based on your diagnostic assessment, ${bizName} is in the **${profile.maturityStage.toUpperCase()}** stage of local marketing maturity.`,
    points: [
      profile.verifiedStrengths.length > 0
        ? `Confirmed Strengths: ${profile.verifiedStrengths.join('; ')}.`
        : 'Foundational marketing assets are currently being established from the ground up.',
      profile.identifiedWeaknesses.length > 0
        ? `Primary Growth Bottlenecks: ${profile.identifiedWeaknesses.join('; ')}.`
        : 'Core visibility channels are operational; focus shifts to consistency and conversion polish.',
      `Review Collection Routine: ${profile.isActivelyCollectingReviews ? 'Active weekly process established' : 'No proactive review request habit in place'}`,
      `Inquiry & Lead Attribution: ${profile.tracksMarketing === 'yes' ? 'Systematically tracked' : 'Untracked; marketing return is currently unmeasured'}`,
    ],
  };

  // 3. Main Opportunities
  const mainOpportunities = {
    title: '3. Main Strategic Opportunities',
    summary: `Highest-leverage areas where ${bizName} can capture market share from competing ${categoryLabel.toLowerCase()} businesses in ${location}.`,
    points: [
      'Local Search Domination: Capturing high-intent smartphone "near me" searches across Google Maps and Apple Maps.',
      'Conversion Optimization: Ensuring mobile visitors find clickable phone dialers, transparent service ranges, and immediate CTAs.',
      'Reputation Moat: Building a compounding stream of genuine 5-star Google reviews with descriptive keywords.',
      'Customer Retention: Creating predictable rebooking or repeat customer habits to reduce new customer acquisition costs.',
    ],
  };

  // 4. Short-Term Priorities (Next 30 Days)
  const shortTermPriorities = {
    title: '4. Short-Term Priorities (Next 30 Days)',
    summary: 'Concrete, quick-win foundations to establish immediate visibility and stop lead leakage.',
    points: [
      profile.isGoogleListingMissingOrUnknown
        ? 'Claim, verify, and complete 100% of your Google Business Profile (categories, hours, phone, and 5+ photos).'
        : 'Audit and refresh your Google Business Profile photos, hours, and attributes.',
      !profile.hasWebsite
        ? 'Outline and deploy a lightweight, mobile-first one-page business website with explicit service radius.'
        : 'Clarify headline and place prominent 1-tap call/booking CTA button above the fold on mobile.',
      'Launch a 1-question "How Did You Find Us?" inquiry tally sheet beside your phone or checkout counter.',
      'Send direct Google review request links to 5 satisfied past clients this week.',
    ],
  };

  // 5. Long-Term Objectives (6–12 Months)
  const longTermObjectives = {
    title: '5. Long-Term Objectives (6–12 Months)',
    summary: 'Strategic milestones to secure market leadership and steady, predictable revenue.',
    points: [
      'Achieve top-3 Local Map Pack placement for the 3 most searched service terms in your area.',
      'Accumulate 40+ positive, descriptive Google customer reviews with a 4.8+ star rating.',
      'Establish a 30-minute recurring weekly marketing rhythm so marketing never lapses during busy operational months.',
      'Build an owned repeat customer contact circle (email VIP club or SMS list) of at least 150 local patrons.',
    ],
  };

  // 6. Recommended Channels
  const recommendedChannels = {
    title: '6. Recommended Marketing Channels & Rhythms',
    summary: 'Focused, high-ROI channels tailored to your capacity and zero-waste budget.',
    points: [
      'Primary Channel: Google Maps & Local Search (Free Organic — accounts for 65%+ of local business discovery).',
      'Secondary Channel: Owned Mobile-Friendly Website (Central conversion hub and credentials validator).',
      'Support Channel: 1 Selected Local Social Platform (Instagram for visual proof, Facebook for neighborhood groups).',
      'Grassroots Channel: Direct customer word-of-mouth and mutual cross-promotions with neighboring businesses.',
    ],
  };

  // 7. Implementation Roadmap
  const implementationSteps = {
    title: '7. Step-by-Step Implementation Roadmap',
    summary: 'Weekly execution blueprint designed to fit comfortably within your available time.',
    points: [
      'Week 1: Core Foundation & Listings. Verify Google Business Profile, audit Name/Address/Phone across directories.',
      'Week 2: Conversion & Contact Clarity. Make primary CTA unmistakable on mobile and activate lead tracking log.',
      'Week 3: Reputation & Social Cadence. Set up review request snippet and schedule 4 authentic behind-the-scenes posts.',
      'Week 4: Review & Monthly Habit. Review lead sources tally, reply to all incoming reviews, and lock in recurring 30-min weekly calendar check-in.',
    ],
  };

  // 8. Success Measurements
  const successMeasurements = {
    title: '8. Success Measurements & KPI Milestones',
    summary: 'Clear, transparent numbers to evaluate progress and business return.',
    points: [
      'New Google Reviews Added: Target 3–5 genuine reviews per month.',
      'Inbound Discovery Growth: Monthly increase in Google Maps direction requests and phone call clicks.',
      'Inquiry Conversion Rate: Target at least 15% conversion from website visitors to direct contacts.',
      'Weekly Habit Consistency: 4 out of 4 weekly 30-minute marketing check-ins executed per month.',
    ],
  };

  // Build complete Markdown document for export
  const markdownContent = `# ${bizName} — Local Marketing Growth Strategy
*Tailored for ${categoryLabel} in ${location}*
*Generated by TapGrow Marketing Advisor on ${new Date().toLocaleDateString()}*

---

## ${businessOverview.title}
${businessOverview.summary}
${businessOverview.points.map((p) => `- ${p}`).join('\n')}

---

## ${currentSituation.title}
${currentSituation.summary}
${currentSituation.points.map((p) => `- ${p}`).join('\n')}

---

## ${mainOpportunities.title}
${mainOpportunities.summary}
${mainOpportunities.points.map((p) => `- ${p}`).join('\n')}

---

## ${shortTermPriorities.title}
${shortTermPriorities.summary}
${shortTermPriorities.points.map((p) => `- ${p}`).join('\n')}

---

## ${longTermObjectives.title}
${longTermObjectives.summary}
${longTermObjectives.points.map((p) => `- ${p}`).join('\n')}

---

## ${recommendedChannels.title}
${recommendedChannels.summary}
${recommendedChannels.points.map((p) => `- ${p}`).join('\n')}

---

## ${implementationSteps.title}
${implementationSteps.summary}
${implementationSteps.points.map((p) => `- ${p}`).join('\n')}

---

## ${successMeasurements.title}
${successMeasurements.summary}
${successMeasurements.points.map((p) => `- ${p}`).join('\n')}

---
*Strategy created with TapGrow • Plan • Improve • Grow*
`;

  return {
    id,
    businessName: bizName,
    businessCategory: profile.category,
    categoryLabel,
    createdAt: now,
    businessOverview,
    currentSituation,
    mainOpportunities,
    shortTermPriorities,
    longTermObjectives,
    recommendedChannels,
    implementationSteps,
    successMeasurements,
    markdownContent,
  };
}
