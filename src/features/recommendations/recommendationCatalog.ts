import { RecommendationTemplate } from '../../types/recommendations';

export const RECOMMENDATION_CATALOG: RecommendationTemplate[] = [
  // ==========================================
  // CORE FOUNDATIONS (APPLICABLE TO LOCAL BUSINESSES)
  // ==========================================

  // 1. Google Business Profile Setup / Verification
  {
    id: 'rec_gbp_setup',
    title: 'Claim and Complete Your Google Business Profile',
    category: 'Google Business Profile',
    defaultPriority: 'High',
    summary: 'Claim, verify, and fill out 100% of your profile fields on Google Maps and Search.',
    whyItMatters:
      'Google Business Profile is the #1 driver of local organic search discovery and map pack visibility for location-based businesses.',
    problemAddressed:
      'Without a verified profile, your business is virtually invisible when nearby customers search "near me" on Google Maps or mobile search.',
    expectedBenefit:
      'Direct map pack placement, increased inbound phone calls, navigation direction requests, and direct customer trust.',
    estimatedEffort: '45–60 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Google Account, official business phone number, business address for postcard/video verification.',
    instructions: [
      'Visit google.com/business and sign in with your primary business Google Account.',
      'Search for your business name to check if an unverified listing already exists, or select "Add your business to Google".',
      'Select the most precise primary category (e.g., "Italian Restaurant" instead of just "Restaurant").',
      'Enter your exact address (or specify your service area radius if you travel to clients and do not receive visitors).',
      'Add current phone number, website link, and accurate regular and holiday business hours.',
      'Upload 5–10 clear, well-lit photos: storefront exterior, interior, team, and key products or service equipment.',
    ],
    suggestedTimeToComplete: 'Week 1',
    referenceUrl: 'https://support.google.com/business/answer/6300665',
    referenceTitle: 'Google Business Profile Help Center',
    completionCriteria:
      'Profile is verified with complete description, hours, phone number, website link, and at least 5 photos.',
    suggestedNextStep:
      'Bookmark your Google Business Profile dashboard and schedule weekly photo and hours reviews.',
    tags: ['google', 'maps', 'local-pack', 'foundations', 'free', 'organic'],
    version: 2,
    defaultPriorityReason:
      'Foundational step: Without a claimed business listing, your business is virtually invisible in local map searches.',
    businessCategories: 'all',
    targetGoals: ['local_visibility', 'more_visits', 'more_enquiries'],
    baseImpactScore: 10,
    baseEffortScore: 4,
    isApplicable: (a) =>
      a.businessModel !== 'online_only' &&
      (a.hasBusinessListing === 'no' || a.hasBusinessListing === 'not_sure'),
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Essential prerequisite: Local customers searching nearby cannot find your operating hours, phone number, or location.',
    }),
  },

  // 2. NAP Consistency Audit
  {
    id: 'rec_nap_consistency',
    title: 'Audit Name, Address, and Phone (NAP) Consistency',
    category: 'Local SEO',
    defaultPriority: 'High',
    summary:
      'Ensure your official business name, phone number, and address are identical across all directories and listings.',
    whyItMatters:
      'Conflicting phone numbers or address variations (e.g. "Ste 4" vs "Apt 4" vs old address) dilute search engine trust and misdirect customers.',
    problemAddressed:
      'Inconsistent directory records divide search engine confidence and result in disconnected phone calls or lost visitors.',
    expectedBenefit:
      'Stronger local algorithmic trust, improved map placement, and zero customer confusion when dialing or driving over.',
    estimatedEffort: '45 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Master record document with official name, address, and telephone format.',
    instructions: [
      'Document your "master record": official business name, official phone number, and exact street address.',
      'Review your listings on Google Business Profile, Apple Maps, Bing Places, and Facebook.',
      'Check secondary local directories (Yelp, YellowPages, local chamber of commerce).',
      'Update any outdated phone numbers, former suite numbers, or slight name abbreviations to match your master record.',
      'Ensure the contact page on your website lists the exact same telephone format and address.',
    ],
    suggestedTimeToComplete: 'Week 1',
    referenceUrl: 'https://developers.google.com/search/docs/crawling-indexing/local-seo',
    referenceTitle: 'Google Search Central Local Guidance',
    completionCriteria:
      'Your top 4 online listings display identical name, phone number, and street address with no conflicting variations.',
    suggestedNextStep:
      'Keep a simple document with your exact business name, address, and phone number format for future directory signups.',
    tags: ['nap', 'consistency', 'citations', 'local-seo', 'free'],
    version: 2,
    defaultPriorityReason: 'Inconsistent contact information causes lost phone calls and confuses search crawlers.',
    businessCategories: 'all',
    targetGoals: ['local_visibility', 'trust_reviews', 'more_enquiries'],
    baseImpactScore: 8,
    baseEffortScore: 3,
    isApplicable: (a) =>
      a.businessModel !== 'online_only' &&
      (a.contactConsistent === 'no' || a.contactConsistent === 'not_sure'),
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Direct risk to foot traffic: Discrepancies in your address or phone number lead directly to lost calls and frustrated customers.',
    }),
  },

  // 3. Apple Maps & Bing Places Secondary Listings
  {
    id: 'rec_apple_bing_listings',
    title: 'Claim Listings on Apple Maps and Bing Places',
    category: 'Business listings',
    defaultPriority: 'Medium',
    summary:
      'Verify your presence on Apple Business Connect (for iPhone Siri & Apple Maps) and Bing Places.',
    whyItMatters:
      'Millions of iPhone users use Apple Maps natively, and Bing powers search for Windows devices and DuckDuckGo.',
    problemAddressed:
      'iPhone Siri searchers and default desktop Windows users cannot find your storefront or contact details.',
    expectedBenefit:
      'Extended reach to millions of iOS users, voice search compatibility, and incremental zero-cost local traffic.',
    estimatedEffort: '30 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Apple ID, Microsoft/Bing account, verified Google Business Profile to auto-import.',
    instructions: [
      'Go to register.apple.com/placesonmaps and sign in with an Apple ID.',
      'Search for your business and claim the location, confirming address and hours.',
      'Go to bingplaces.com and choose "Import from Google Business Profile" to sync all verified data in under 2 minutes.',
      'Confirm category, contact email, and upload your primary logo.',
    ],
    suggestedTimeToComplete: 'Week 2',
    referenceUrl: 'https://register.apple.com/placesonmaps',
    referenceTitle: 'Apple Business Connect',
    completionCriteria:
      'Both Apple Maps and Bing Places profiles are claimed and match your primary Google listing.',
    suggestedNextStep:
      'Verify your location appears accurately when searching on an iPhone in Apple Maps.',
    tags: ['apple-maps', 'bing', 'directories', 'free'],
    version: 2,
    defaultPriorityReason: 'Captures iPhone and Windows desktop users who do not rely solely on Google.',
    businessCategories: 'all',
    targetGoals: ['local_visibility', 'more_visits'],
    baseImpactScore: 6,
    baseEffortScore: 2,
    isApplicable: (a) => a.businessModel !== 'online_only',
    evaluatePriority: (a) => ({
      priority: a.weeklyHours === 'under_1h' ? 'Low' : 'Medium',
      reason: 'Expands your search footprint to Apple iOS and Windows users beyond Google alone.',
    }),
  },

  // 4. Honest Customer Review Request Process
  {
    id: 'rec_review_system',
    title: 'Establish a Simple Customer Review Request Routine',
    category: 'Reviews and reputation',
    defaultPriority: 'High',
    summary:
      'Create a standardized, compliant habit of asking satisfied customers for an honest Google review right after service.',
    whyItMatters:
      'Recent reviews with descriptive text are one of the strongest factors in customer decision-making and local map placement.',
    problemAddressed:
      'Happy clients leave without reviewing, while motivated unhappy outliers skew your public score downwards.',
    expectedBenefit:
      'Steadily climbing Google star rating, social proof that converts hesitant browsers, and improved local search rank.',
    estimatedEffort: '30 mins setup + 5 mins/week',
    difficultyLevel: 'Beginner',
    requiredResources: 'Direct Google review link, SMS/Email message template, smartphone.',
    instructions: [
      'Generate your direct Google review link in your Google Business Profile dashboard ("Ask for reviews" button).',
      'Create a clean short-link or save the link in your phone notes for easy sharing.',
      'Draft a polite 2-sentence text/email template: "Thank you for visiting us today! If you had a great experience, could you take 30 seconds to leave us an honest review? [Link] - It helps our small business tremendously."',
      'Never offer discounts, free gifts, or prohibited incentives in exchange for reviews (violates review platform policies).',
      'Commit to sending the link to 3-5 real customers per week immediately after a successful transaction or project completion.',
    ],
    suggestedTimeToComplete: 'Week 1',
    referenceUrl: 'https://support.google.com/business/answer/3474122',
    referenceTitle: 'Google Guidelines for Reviews',
    completionCriteria:
      'Direct review link generated, message template saved, and at least 3 customer requests sent this week.',
    suggestedNextStep:
      'Save your review request snippet in your smartphone keyboard shortcuts for rapid sending.',
    tags: ['reviews', 'reputation', 'google-reviews', 'trust', 'free', 'organic'],
    version: 2,
    defaultPriorityReason:
      'Without recent positive reviews, potential customers usually choose higher-rated nearby competitors.',
    businessCategories: 'all',
    targetGoals: ['trust_reviews', 'local_visibility', 'more_enquiries'],
    baseImpactScore: 9,
    baseEffortScore: 2,
    isApplicable: (a) => a.askForReviews === 'no' || a.askForReviews === 'not_sure',
    evaluatePriority: () => ({
      priority: 'High',
      reason: 'Social proof drives conversions: Prospective customers read reviews before dialing or visiting.',
    }),
  },

  // 5. Review Response Strategy
  {
    id: 'rec_review_responses',
    title: 'Respond to All Existing and New Online Reviews',
    category: 'Reviews and reputation',
    defaultPriority: 'Medium',
    summary:
      'Write professional, thoughtful responses to every customer review, both positive and critical.',
    whyItMatters:
      'Responding demonstrates active customer care to prospective clients browsing your profile and signals active business ownership.',
    problemAddressed:
      'Unanswered reviews make a business appear abandoned or indifferent to client feedback.',
    expectedBenefit:
      'De-escalates customer frustration, proves attentive customer service, and signals ongoing activity to search engines.',
    estimatedEffort: '20 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Access to Google Business Profile dashboard.',
    instructions: [
      'Set aside 15 minutes each Monday to review incoming feedback.',
      'For 5-star reviews: Thank them by name, mention the specific dish or service they enjoyed, and welcome them back.',
      'For negative reviews: Remain calm and polite, acknowledge their frustration, apologize for falling short of your standard, and provide a direct owner phone/email to discuss privately offline.',
      'Never argue or disclose customer private details in public review responses.',
    ],
    suggestedTimeToComplete: 'Week 2',
    completionCriteria:
      'All reviews on your primary profile from the past 3 months have a calm, professional owner response.',
    suggestedNextStep:
      'Respond to any unaddressed review within 48 hours to maintain a responsive rating.',
    tags: ['reviews', 'customer-service', 'reputation', 'free'],
    version: 2,
    defaultPriorityReason: 'Shows potential customers that you listen and care about customer satisfaction.',
    businessCategories: 'all',
    targetGoals: ['trust_reviews', 'customer_retention'],
    baseImpactScore: 6,
    baseEffortScore: 2,
    isApplicable: () => true,
    evaluatePriority: (a) => ({
      priority: a.askForReviews === 'yes' ? 'Medium' : 'Low',
      reason: 'Maintains an active, responsive public reputation for anyone checking your track record.',
    }),
  },

  // 6. Website Planning Task (For businesses without a website)
  {
    id: 'rec_website_planning',
    title: 'Plan a Simple One-Page Local Business Website',
    category: 'Website basics',
    defaultPriority: 'High',
    summary:
      'Outline essential information needed for a lightweight, fast, one-page business website.',
    whyItMatters:
      'A website acts as your owned digital storefront. Relying exclusively on social media leaves you vulnerable to algorithm changes.',
    problemAddressed:
      'Without an owned website, prospective customers cannot verify your legitimacy or review your service catalog after hours.',
    expectedBenefit:
      'An owned digital asset you control, rankable in Google Search, with dedicated conversion buttons and service details.',
    estimatedEffort: '1–2 hours',
    difficultyLevel: 'Beginner',
    requiredResources: 'Text editor or notebook, brand logo, photos of work, domain registrar account.',
    instructions: [
      'Write a clear 1-line headline explaining what you do and where you do it (e.g., "Handcrafted sourdough bakery & espresso bar in Ballard, Seattle").',
      'List your top 3–5 core services or product categories with transparent starting prices or descriptions.',
      'Add your business hours, street address / service radius, and clickable phone number.',
      'Choose a clean, accessible website platform (or simple static site) that does not require heavy monthly retainers.',
      'Ensure the website is mobile-friendly with large tap targets for phone calls.',
    ],
    suggestedTimeToComplete: 'Week 2',
    completionCriteria:
      'Content outline written and ready to be published on an owned domain.',
    suggestedNextStep:
      'Register your business domain name and deploy a lightweight single-page template.',
    tags: ['website', 'foundations', 'copywriting'],
    version: 2,
    defaultPriorityReason:
      'Essential digital asset: Without a website, search engines have limited context to index your full service offerings.',
    businessCategories: 'all',
    targetGoals: ['website_improvement', 'local_visibility', 'more_enquiries'],
    baseImpactScore: 9,
    baseEffortScore: 5,
    isApplicable: (a) => a.hasWebsite === 'no',
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Highest leverage: Gives prospective clients a direct destination to learn about your services and contact you.',
    }),
  },

  // 7. Website Service & Location Clarity Audit
  {
    id: 'rec_website_clarity',
    title: 'Clarify Services, Service Area, and Contact Info on Your Website',
    category: 'Website basics',
    defaultPriority: 'High',
    summary:
      'Ensure your homepage clearly communicates your exact location/service coverage and how to book or call.',
    whyItMatters:
      'Visitors leave within 5 seconds if they cannot immediately confirm whether you serve their neighborhood or offer what they need.',
    problemAddressed:
      'Vague homepages cause high bounce rates because visitors cannot quickly confirm if you operate in their area.',
    expectedBenefit:
      'Reduced bounce rates, immediate visitor orientation, and higher percentage of visitors proceeding to contact you.',
    estimatedEffort: '45 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Website CMS login, smartphone for mobile preview.',
    instructions: [
      'Check the top "above-the-fold" section on your homepage on a mobile phone.',
      'Ensure your town/city name appears in the main headline or immediately below it (e.g., "Plumbing & Heating Services in Austin, TX").',
      'List specific neighborhoods or zip codes you serve in a dedicated "Service Areas" section.',
      'Ensure your phone number is a clickable link (`tel:+1...`) so mobile users can dial in one tap.',
      'Place your physical address and embedded map on your Contact page.',
    ],
    suggestedTimeToComplete: 'Week 1',
    completionCriteria:
      'Mobile visitors can confirm your location, services, and dial your phone number within 5 seconds of loading.',
    suggestedNextStep:
      'Perform a 5-second test with a friend on their phone to verify instant comprehension of your area and services.',
    tags: ['website', 'clarity', 'conversion', 'mobile', 'free'],
    version: 2,
    defaultPriorityReason:
      'Fixes immediate bounce rate: stops interested visitors from leaving because location was unclear.',
    businessCategories: 'all',
    targetGoals: ['website_improvement', 'more_enquiries'],
    baseImpactScore: 8,
    baseEffortScore: 3,
    isApplicable: (a) =>
      a.hasWebsite === 'yes' &&
      (a.websiteDetailsClear === 'no' || a.websiteDetailsClear === 'not_sure'),
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Prevents customer drop-off: Visitors need immediate confirmation that you operate in their area.',
    }),
  },

  // 8. Conversion Action (CTA) Optimization
  {
    id: 'rec_cta_optimization',
    title: 'Add Prominent Calls to Action to Key Pages',
    category: 'Conversion improvements',
    defaultPriority: 'High',
    summary:
      'Replace vague "Submit" buttons with clear, action-oriented primary conversion buttons.',
    whyItMatters:
      'Clear guidance increases inquiries by removing hesitation about what happens next.',
    problemAddressed:
      'Interested visitors browse your pages but exit without contacting you because the next step is unclear or buried.',
    expectedBenefit:
      'Direct increase in phone inquiries, quote requests, and appointment bookings from existing website visitors.',
    estimatedEffort: '30 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Website CMS login.',
    instructions: [
      'Choose one primary action that drives your business (e.g. "Call for Estimate", "Book a Table", "Request Consultation").',
      'Place this primary button in your website header so it remains visible on all pages.',
      'Repeat the CTA button directly below your service descriptions and at the bottom of the page.',
      'State what happens next beneath the button (e.g., "We respond within 2 hours during business days").',
    ],
    suggestedTimeToComplete: 'Week 2',
    completionCriteria:
      'Primary CTA button appears at least twice on your homepage with explicit next-step expectations.',
    suggestedNextStep:
      'Test the button on your own smartphone to make sure the form or telephone dialer opens smoothly.',
    tags: ['conversion', 'cta', 'leads', 'website', 'free'],
    version: 2,
    defaultPriorityReason:
      'Turns existing website visitors into actual phone calls and paying clients.',
    businessCategories: 'all',
    targetGoals: ['more_enquiries', 'website_improvement', 'more_bookings'],
    baseImpactScore: 9,
    baseEffortScore: 2,
    isApplicable: (a) =>
      a.clearConversionAction === 'no' || a.clearConversionAction === 'not_sure',
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Direct revenue impact: Ensures interested visitors know exactly how to buy or get in touch.',
    }),
  },

  // 9. Common Customer Questions (FAQ) Content
  {
    id: 'rec_faq_content',
    title: 'Publish Answers to the Top 5 Common Customer Questions',
    category: 'Content marketing',
    defaultPriority: 'Medium',
    summary:
      'Write and publish concise, helpful answers to the questions customers ask most frequently before buying.',
    whyItMatters:
      'Addresses pre-purchase objections, reduces repetitive phone calls, and helps your site rank for conversational search queries.',
    problemAddressed:
      'Potential clients have unasked doubts about pricing, timing, or process that prevent them from reaching out.',
    expectedBenefit:
      'Removes purchasing hesitation, qualifies inbound leads, and captures voice search / long-tail local search queries.',
    estimatedEffort: '1 hour',
    difficultyLevel: 'Beginner',
    requiredResources: 'List of top 5 customer questions, website editor or social page.',
    instructions: [
      'Identify the top 5 questions clients ask (e.g., pricing ranges, turnaround times, parking, warranty, preparation).',
      'Write clear, straightforward 2-3 paragraph answers without jargon.',
      'Add an FAQ section to your website homepage or dedicated services page.',
      'Post each Q&A as a standalone helpful update on your Google Business Profile and social media.',
    ],
    suggestedTimeToComplete: 'Week 3',
    completionCriteria:
      '5 questions and answers published on your website and shared as a Google update.',
    suggestedNextStep:
      'Add an FAQ accordion section on your main service page and link to it from customer emails.',
    tags: ['content', 'faq', 'customer-service', 'seo', 'free'],
    version: 2,
    defaultPriorityReason:
      'Builds immediate credibility and answers buyer hesitations before they even call.',
    businessCategories: 'all',
    targetGoals: ['more_enquiries', 'trust_reviews', 'website_improvement'],
    baseImpactScore: 7,
    baseEffortScore: 3,
    isApplicable: (a) =>
      a.publishesContent === 'no' || a.publishesContent === 'not_sure',
    evaluatePriority: (a) => ({
      priority:
        a.mainGoal === 'more_enquiries' || a.mainGoal === 'trust_reviews'
          ? 'High'
          : 'Medium',
      reason:
        'Eliminates buying friction and helps qualify serious inquiries before they reach out.',
    }),
  },

  // 10. Local Social Media Rhythm
  {
    id: 'rec_social_batching',
    title: 'Batch 4 Practical, Locally Relevant Social Posts',
    category: 'Social media',
    defaultPriority: 'Medium',
    summary:
      'Plan and schedule one month of authentic social content highlighting behind-the-scenes work, tips, and local community connection.',
    whyItMatters:
      'Consistent, authentic posts keep your business top-of-mind with past clients and show prospective customers you are active.',
    problemAddressed:
      'Sporadic posting creates feast-or-famine social presence, leading to marketing stress and neglected accounts.',
    expectedBenefit:
      'Consistent organic visibility, community familiarity, and repeat customer recall without daily time loss.',
    estimatedEffort: '45 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Smartphone camera, 4 photos of genuine daily work, free scheduling tool.',
    instructions: [
      'Take 4 authentic photos during ordinary workday activities (e.g. fresh batch of goods, completed project, team member at work, customer tip).',
      'Write short, natural captions explaining what was accomplished or sharing a practical tip.',
      'Tag your specific neighborhood or local landmarks where appropriate.',
      'Schedule or post one per week at a consistent day and time.',
    ],
    suggestedTimeToComplete: 'Week 3',
    completionCriteria:
      '4 real photos and captions prepared and scheduled for the upcoming month.',
    suggestedNextStep:
      'Set a calendar reminder for 10 minutes every Monday to review customer reactions and reply to comments.',
    tags: ['social-media', 'content', 'local-community', 'free'],
    version: 2,
    defaultPriorityReason:
      'Maintains active visibility without requiring hours of daily social media management.',
    businessCategories: 'all',
    targetGoals: ['marketing_consistency', 'customer_retention'],
    baseImpactScore: 6,
    baseEffortScore: 3,
    isApplicable: (a) => a.socialPresence !== 'none',
    evaluatePriority: (a) => ({
      priority:
        a.mainGoal === 'marketing_consistency' ? 'High' : 'Medium',
      reason:
        'Prevents social media burnout by batching authentic local content in advance.',
    }),
  },

  // 11. Social Channel Setup (For businesses with zero social presence)
  {
    id: 'rec_social_starter',
    title: 'Set Up One Dedicated Local Social Channel',
    category: 'Social media',
    defaultPriority: 'Medium',
    summary:
      'Choose the single social platform where your customers are most active and complete a professional profile.',
    whyItMatters:
      'Focusing on one platform well is much more effective for a local business than maintaining four neglected accounts.',
    problemAddressed:
      'Zero social discovery channels leaves out younger demographics who search Instagram or Facebook for local recommendations.',
    expectedBenefit:
      'A trusted social presence matching your brand, enabling direct neighborhood recommendations and shares.',
    estimatedEffort: '30 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'High-res logo square, cover photo, business bio text.',
    instructions: [
      'Select ONE platform: Instagram (visual products, food, salons, decor), Facebook (neighborhood groups, trades, home services), or LinkedIn (B2B professional services).',
      'Use your official business name and clear logo as avatar.',
      'Include your location, website link, and primary phone number in the bio.',
      'Publish an introductory post describing your business story and welcoming local customers.',
    ],
    suggestedTimeToComplete: 'Week 3',
    completionCriteria:
      'One single social profile completed with official branding, location, contact info, and welcome post.',
    suggestedNextStep:
      'Share your new profile link with existing happy customers and friends to establish initial following.',
    tags: ['social-media', 'starter', 'branding', 'free'],
    version: 2,
    defaultPriorityReason:
      'Establishes a recognizable social touchpoint without overwhelming your weekly schedule.',
    businessCategories: 'all',
    targetGoals: ['marketing_consistency', 'local_visibility'],
    baseImpactScore: 6,
    baseEffortScore: 2,
    isApplicable: (a) => a.socialPresence === 'none',
    evaluatePriority: () => ({
      priority: 'Medium',
      reason: 'Gives local residents another familiar channel to discover your work.',
    }),
  },

  // 12. Manual Lead & Source Tracking Log
  {
    id: 'rec_lead_tracking',
    title: 'Start a 1-Question "How Did You Find Us?" Inquiry Log',
    category: 'Marketing measurement',
    defaultPriority: 'High',
    summary:
      'Ask every new customer how they discovered your business and record it in a simple tally sheet or spreadsheet.',
    whyItMatters:
      'Knowing which channels (Google Maps, friend referral, Instagram, street signage) actually bring paying customers prevents wasted marketing time.',
    problemAddressed:
      'Spending marketing effort blindly without data on which activities actually generate revenue.',
    expectedBenefit:
      'Uncompromising clarity on your #1 and #2 revenue sources, allowing you to stop wasting time on low-yield tactics.',
    estimatedEffort: '15 mins setup + 30 secs per inquiry',
    difficultyLevel: 'Beginner',
    requiredResources: 'Notebook or free Google Sheet.',
    instructions: [
      'Train staff or add a prompt by the register/phone: "By the way, how did you first hear about us?"',
      'Create a simple 3-column spreadsheet or notepad: Date, Customer Name, Source (Google, Referral, Walk-by, Social).',
      'Review the counts at the end of every month.',
      'Double down on the top 2 sources that bring paying customers.',
    ],
    suggestedTimeToComplete: 'Week 1',
    completionCriteria:
      'Inquiry tracking sheet active and first 5 customer sources recorded.',
    suggestedNextStep:
      'Review your tally sheet at the end of the month to identify your #1 customer discovery source.',
    tags: ['tracking', 'measurement', 'roi', 'analytics', 'free'],
    version: 2,
    defaultPriorityReason:
      'Prevents blind spending: you cannot improve what you do not measure.',
    businessCategories: 'all',
    targetGoals: ['marketing_consistency', 'more_enquiries'],
    baseImpactScore: 8,
    baseEffortScore: 1,
    isApplicable: (a) =>
      a.tracksMarketing === 'no' || a.tracksMarketing === 'not_sure',
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Eliminates guesswork: Directly reveals which marketing efforts generate real revenue.',
    }),
  },

  // 13. Weekly 30-Minute Marketing Routine
  {
    id: 'rec_weekly_routine',
    title: 'Establish a Dedicated 30-Minute Weekly Marketing Habit',
    category: 'Measurement and consistency',
    defaultPriority: 'Medium',
    summary:
      'Block a recurring 30-minute calendar slot every week to review reviews, update hours, and check inquiry sources.',
    whyItMatters:
      'Local business marketing succeeds through small, consistent weekly habits rather than sporadic panic campaigns.',
    problemAddressed:
      'Marketing only happens when business is slow, creating erratic customer flow and stressful scrambles.',
    expectedBenefit:
      'Compounding local discovery, up-to-date business profiles, and steady inquiries year-round.',
    estimatedEffort: '30 mins / week',
    difficultyLevel: 'Beginner',
    requiredResources: 'Digital calendar or wall planner.',
    instructions: [
      'Choose a fixed, quiet time slot (e.g. Tuesday at 9:00 AM or Friday afternoon).',
      'Minute 0–10: Check and reply to new Google reviews.',
      'Minute 10–20: Post one helpful photo or update to Google Business Profile or social media.',
      'Minute 20–30: Review your inquiry log and note what worked.',
    ],
    suggestedTimeToComplete: 'Week 2',
    completionCriteria:
      'Recurring calendar block scheduled and executed for two consecutive weeks.',
    suggestedNextStep:
      'Create a calendar recurring event for every Tuesday morning titled "Weekly 30-Min Marketing Check-in".',
    tags: ['consistency', 'habit', 'routine', 'free'],
    version: 2,
    defaultPriorityReason:
      'Consistency compounds over time into dominant local authority.',
    businessCategories: 'all',
    targetGoals: ['marketing_consistency'],
    baseImpactScore: 7,
    baseEffortScore: 2,
    isApplicable: () => true,
    evaluatePriority: (a) => ({
      priority:
        a.mainGoal === 'marketing_consistency' ? 'High' : 'Medium',
      reason:
        'Guarantees steady momentum so marketing does not get lost during busy operational periods.',
    }),
  },

  // 14. Mobile Usability & Tap Targets
  {
    id: 'rec_mobile_speed',
    title: 'Test Mobile Usability and Call-Button Tap Targets',
    category: 'Website basics',
    defaultPriority: 'Medium',
    summary:
      'Check that your website loads fast on cellular data and that buttons are easily clickable with one thumb.',
    whyItMatters:
      'Over 70% of local searches happen on mobile devices, often while the customer is on the go or in a vehicle.',
    problemAddressed:
      'Frustrating mobile layouts with tiny buttons or slow images cause visitors to click back to competitors.',
    expectedBenefit:
      'Seamless phone browsing, instant one-tap calls, and higher conversion rates from mobile searchers.',
    estimatedEffort: '30 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Smartphone on cellular data connection.',
    instructions: [
      'Open your website on a mobile device disconnected from Wi-Fi (cellular connection).',
      'Verify that page content appears within 2–3 seconds without shifting around.',
      'Ensure buttons and phone links have at least 44x44 pixel tap areas so they are effortless to press.',
      'Compress any oversized banner image files that cause laggy mobile scrolling.',
    ],
    suggestedTimeToComplete: 'Week 3',
    completionCriteria:
      'Mobile test completed on a real phone; phone links and navigation tested with one thumb.',
    suggestedNextStep:
      'Test on both an iPhone and an Android phone to ensure consistent font sizing and tap targets.',
    tags: ['mobile', 'speed', 'ux', 'website', 'free'],
    version: 2,
    defaultPriorityReason:
      'Prevents friction when mobile shoppers attempt to reach you while out and about.',
    businessCategories: 'all',
    targetGoals: ['website_improvement', 'more_enquiries'],
    baseImpactScore: 7,
    baseEffortScore: 2,
    isApplicable: (a) => a.hasWebsite === 'yes',
    evaluatePriority: () => ({
      priority: 'Medium',
      reason: 'Ensures the majority of mobile searchers have a smooth experience without bouncing.',
    }),
  },

  // ==========================================
  // CATEGORY-SPECIFIC SMART RECOMMENDATIONS
  // ==========================================

  // --- RESTAURANTS & CAFES ---
  {
    id: 'rec_cat_restaurant_menu',
    title: 'Upload a Mobile-Friendly, Text-Based Online Menu',
    category: 'Website basics',
    defaultPriority: 'High',
    summary:
      'Replace low-res PDF or photo menu uploads with mobile-readable text and direct menu sections on Google and your website.',
    whyItMatters:
      'Diners decide within seconds whether to visit based on menu offerings and prices. Unreadable PDFs on phones drive hungry customers directly to competitors.',
    problemAddressed:
      'Diners cannot pinch-zoom blurry PDF menus on small smartphone screens while deciding where to eat.',
    expectedBenefit:
      'Immediate appetite appeal, search engine indexing of specific dishes, and direct walk-in decisions.',
    estimatedEffort: '45–60 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Current dining menu, dish descriptions, dietary tags, 3-5 dish photos.',
    instructions: [
      'Add your full menu with up-to-date prices in plain HTML text on your website so it is mobile-zoom friendly and indexable by search engines.',
      'Sync your primary dishes and categories directly into the Google Business Profile "Menu" tab with descriptions and prices.',
      'Add clear dietary callouts (e.g. Vegetarian, Gluten-Free, Vegan, Halal, Nut-free) so guests can order with confidence.',
      'Include 3–5 high-quality photos of your most popular signature dishes with natural lighting.',
    ],
    suggestedTimeToComplete: 'Week 1',
    referenceUrl: 'https://support.google.com/business/answer/3039617',
    referenceTitle: 'Google Business Profile Menu Guidelines',
    completionCriteria:
      'Menu is readable on mobile without pinching/zooming, prices are accurate, and dishes are populated in Google Maps Menu tab.',
    suggestedNextStep:
      'Ask a friend to view your menu on their phone while standing outdoors to verify fast loading and legibility.',
    tags: ['restaurants', 'menu', 'food', 'local-dining', 'free'],
    version: 2,
    defaultPriorityReason:
      'For restaurants, the menu is the primary conversion catalyst for diners researching nearby meals.',
    businessCategories: ['restaurant_cafe'],
    targetGoals: ['more_visits', 'website_improvement', 'local_visibility'],
    baseImpactScore: 10,
    baseEffortScore: 3,
    isApplicable: (a) =>
      a.category === 'restaurant_cafe' && a.restaurantOnlineMenu !== 'yes',
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Immediate customer impact: 85%+ of restaurant patrons review the menu and pricing before selecting a venue.',
    }),
  },
  {
    id: 'rec_cat_restaurant_hours_location',
    title: 'Highlight Kitchen Hours, Parking & Table Reservation Options',
    category: 'Conversion improvements',
    defaultPriority: 'High',
    summary:
      'Clarify kitchen closing times, parking instructions, and how to reserve a table or place a pickup order.',
    whyItMatters:
      'Diners frequently get frustrated when kitchen cut-off times differ from bar hours or when parking is confusing in dense urban areas.',
    problemAddressed:
      'Customers show up after the kitchen has closed or abandon the trip because parking seems too intimidating.',
    expectedBenefit:
      'Frictionless dining visits, fewer confused phone inquiries during dinner rush, and higher table occupancy.',
    estimatedEffort: '30 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Verified kitchen hours, parking guide text, booking/ordering link.',
    instructions: [
      'State specific kitchen closing times if they differ from general business operating hours.',
      'Provide concise parking directions (e.g., street parking options, nearest garage, or validated parking).',
      'Add a prominent "Reserve a Table" or "Order for Pickup" button directly in your website header and Google Business Profile.',
      'Specify group seating policies and takeout ordering turnaround time.',
    ],
    suggestedTimeToComplete: 'Week 2',
    completionCriteria:
      'Kitchen hours, parking notes, and reservation link are visibly highlighted on your website and profile.',
    suggestedNextStep:
      'Verify your business listing holiday hours before the next upcoming public holiday.',
    tags: ['restaurants', 'hours', 'parking', 'reservations', 'free'],
    version: 2,
    defaultPriorityReason:
      'Removes visit friction and prevents walk-in disappointment when dining hours are uncertain.',
    businessCategories: ['restaurant_cafe'],
    targetGoals: ['more_visits', 'more_bookings', 'more_enquiries'],
    baseImpactScore: 9,
    baseEffortScore: 2,
    isApplicable: (a) =>
      a.category === 'restaurant_cafe' && a.restaurantHoursLocationClear !== 'yes',
    evaluatePriority: () => ({
      priority: 'High',
      reason: 'Eliminates uncertainty: Clear dining logistics turn casual browsers into booked seats.',
    }),
  },
  {
    id: 'rec_cat_restaurant_vip',
    title: 'Build a Direct VIP Diner Table & Weekly Specials List',
    category: 'Customer retention',
    defaultPriority: 'Medium',
    summary:
      'Invite regular diners to join a zero-spam weekly specials text or email circle for secret chef items.',
    whyItMatters:
      'Acquiring a new diner costs 5x more than welcoming back a past patron. A direct VIP list fills tables on slow weeknights.',
    problemAddressed:
      'Slow Tuesday/Wednesday shifts with empty tables despite a large base of past satisfied weekend diners.',
    expectedBenefit:
      'Predictable mid-week covers, higher lifetime dining value, and zero third-party delivery commission fees.',
    estimatedEffort: '40 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Simple sign-up card at register or QR code on bill folder.',
    instructions: [
      'Print a small discreet tent card or check-folder insert: "Join our Neighborhood Tasting Club for monthly secret off-menu specials."',
      'Collect simple email or SMS permissions ethically.',
      'Send one warm message every 2 weeks highlighting a seasonal dish or wine pairing.',
    ],
    suggestedTimeToComplete: 'Week 3',
    completionCriteria: 'VIP invite live on check slips and initial 10 subscribers gathered.',
    suggestedNextStep: 'Draft your first seasonal chef special message to send on a slower Wednesday afternoon.',
    tags: ['restaurant', 'retention', 'loyalty', 'vip'],
    version: 2,
    defaultPriorityReason: 'Fills slow weeknight tables using your own loyal customer relationships.',
    businessCategories: ['restaurant_cafe'],
    targetGoals: ['customer_retention', 'more_visits'],
    baseImpactScore: 7,
    baseEffortScore: 2,
    isApplicable: (a) => a.category === 'restaurant_cafe',
    evaluatePriority: () => ({
      priority: 'Medium',
      reason: 'Strengthens repeat dining frequency and increases midweek revenue.',
    }),
  },

  // --- SALONS, SPAS & WELLNESS ---
  {
    id: 'rec_cat_salon_pricelist',
    title: 'Publish Transparent Service Durations and Pricing Menu',
    category: 'Conversion improvements',
    defaultPriority: 'High',
    summary:
      'Provide upfront service menus detailing what each treatment includes, expected duration, and clear starting prices.',
    whyItMatters:
      'Clients hesitate to book appointments when prices are hidden behind "Call for pricing" or when treatment durations are unclear.',
    problemAddressed:
      'Price anxiety prevents clients from taking the step to book high-end styling, spa, or aesthetic appointments.',
    expectedBenefit:
      'Immediate client confidence, qualified bookings, and fewer price-shopping phone calls.',
    estimatedEffort: '45 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Categorized service list, starting rates, estimated appointment durations.',
    instructions: [
      'Organize services into intuitive groups (e.g., Cuts & Styling, Coloring, Facials & Skincare, Nail Care, Massages).',
      'List starting prices and estimated durations for each service (e.g., "Full Balayage: From $140 · Approx. 2.5 hours").',
      'Explain preparation instructions for first-time visitors (e.g., arriving 10 minutes early or patch test requirements).',
      'Publish this menu cleanly on your website and add service items directly into your Google profile service catalog.',
    ],
    suggestedTimeToComplete: 'Week 1',
    completionCriteria:
      'Clear service menu with starting prices, durations, and descriptions is visible online.',
    suggestedNextStep:
      'Add your service menu link to your Instagram and Facebook profile bios.',
    tags: ['salon', 'wellness', 'pricing', 'spa', 'free'],
    version: 2,
    defaultPriorityReason:
      'Upfront transparent pricing is the top conversion driver for salon and wellness clients.',
    businessCategories: ['salon_wellness'],
    targetGoals: ['more_bookings', 'more_enquiries', 'trust_reviews'],
    baseImpactScore: 9,
    baseEffortScore: 2,
    isApplicable: (a) =>
      a.category === 'salon_wellness' && a.salonServicePriceListOnline !== 'yes',
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Reduces booking hesitation: Clients prefer booking providers whose rates and durations are openly stated.',
    }),
  },
  {
    id: 'rec_cat_salon_booking',
    title: 'Enable Direct Online Booking or 1-Tap WhatsApp/SMS Inquiries',
    category: 'Conversion improvements',
    defaultPriority: 'High',
    summary:
      'Allow clients to request or schedule appointments 24/7 without playing phone tag during busy treatment hours.',
    whyItMatters:
      'Over 60% of salon bookings occur in evenings after normal opening hours when phone lines are unattended.',
    problemAddressed:
      'Lost appointments because stylists cannot answer ringing phones while hands are busy with treatments.',
    expectedBenefit:
      'Around-the-clock booking capture, automated calendar slot filling, and reduced phone interruptions during service.',
    estimatedEffort: '30–45 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Online scheduling tool or dedicated WhatsApp business link.',
    instructions: [
      'If using a booking platform (e.g. Fresha, Vagaro, Square Appointments, or Calendly), connect your "Book Online" button into your Google Business Profile and website.',
      'If accepting direct messages, provide a 1-tap WhatsApp or SMS link with pre-filled text (e.g. "Hi, I would like to check availability for...").',
      'State your cancellation and rescheduling policy clearly next to the booking button.',
    ],
    suggestedTimeToComplete: 'Week 2',
    completionCriteria:
      'Direct booking or messaging link is functional and tested from a mobile phone.',
    suggestedNextStep:
      'Place your booking button in the top-right corner of your site header for immediate access.',
    tags: ['salon', 'booking', 'appointments', 'conversion'],
    version: 2,
    defaultPriorityReason:
      'Captures after-hours clients who cannot call during your working hours.',
    businessCategories: ['salon_wellness'],
    targetGoals: ['more_bookings', 'more_enquiries'],
    baseImpactScore: 9,
    baseEffortScore: 3,
    isApplicable: (a) =>
      a.category === 'salon_wellness' && a.salonOnlineBookingAvailable !== 'yes',
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Direct booking convenience prevents lost appointments when you are busy attending to clients.',
    }),
  },
  {
    id: 'rec_cat_salon_retention',
    title: 'Automate a 6-Week Client Rebooking Reminder Habit',
    category: 'Customer retention',
    defaultPriority: 'Medium',
    summary:
      'Prompt clients to lock in their next appointment at checkout before walking out the door.',
    whyItMatters:
      'Clients intending to return often wait 10–12 weeks unless guided to rebook at the 6-week cadence.',
    problemAddressed:
      'Gaps in client appointment frequency that diminish annual salon revenue by 30%.',
    expectedBenefit:
      'Full appointment books weeks in advance, higher recurring revenue, and consistent client relationships.',
    estimatedEffort: '20 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Front desk booking script or calendar reminder.',
    instructions: [
      'Train staff at checkout: "Let\'s secure your preferred slot in 6 weeks so you don\'t have to compete for busy weekend times."',
      'Send a courteous 48-hour pre-appointment text reminder.',
    ],
    suggestedTimeToComplete: 'Week 3',
    completionCriteria: 'Checkout rebooking question asked to 10 consecutive clients.',
    suggestedNextStep: 'Note client rebooking preferences in their client card.',
    tags: ['salon', 'retention', 'rebooking', 'habits'],
    version: 2,
    defaultPriorityReason: 'Keeps appointment schedules steadily booked weeks in advance.',
    businessCategories: ['salon_wellness'],
    targetGoals: ['customer_retention', 'more_bookings'],
    baseImpactScore: 8,
    baseEffortScore: 1,
    isApplicable: (a) => a.category === 'salon_wellness',
    evaluatePriority: () => ({
      priority: 'Medium',
      reason: 'Drives recurring appointment revenue without requiring new advertising.',
    }),
  },

  // --- HEALTH CLINICS & MEDICAL PRACTICES ---
  {
    id: 'rec_cat_clinic_appointments',
    title: 'Clarify Appointment Scheduling & New Patient Onboarding',
    category: 'Website basics',
    defaultPriority: 'High',
    summary:
      'Display step-by-step instructions for new patient bookings, intake forms, and emergency protocols.',
    whyItMatters:
      'Patients seeking healthcare require immediate clarity on whether you accept new patients, appointment wait times, and consultation options.',
    problemAddressed:
      'Anxious patients cannot tell if your clinic is accepting new patients or what intake documentation is required.',
    expectedBenefit:
      'Lower front-desk administrative call volume, smoother patient onboarding, and faster appointment booking.',
    estimatedEffort: '45 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Patient onboarding steps, intake form download link, emergency contact policy.',
    instructions: [
      'Create a prominent "New Patients" section explaining how to schedule (online intake vs dedicated phone extension).',
      'Provide downloadable intake forms or an online questionnaire link to save time in the waiting room.',
      'Display clear emergency disclaimers directing acute emergencies to local hospital resources.',
      'State telehealth / video consultation availability if offered.',
    ],
    suggestedTimeToComplete: 'Week 1',
    completionCriteria:
      'New patient booking workflow, intake process, and emergency guidance are published prominently.',
    suggestedNextStep:
      'Have front-desk staff review the new patient guide to ensure phone instructions match the website.',
    tags: ['healthcare', 'clinic', 'patients', 'appointments', 'free'],
    version: 2,
    defaultPriorityReason: 'Crucial for patient accessibility and smooth clinical operations.',
    businessCategories: ['health_clinic'],
    targetGoals: ['more_enquiries', 'more_bookings', 'trust_reviews'],
    baseImpactScore: 9,
    baseEffortScore: 3,
    isApplicable: (a) =>
      a.category === 'health_clinic' && a.clinicAppointmentInfoClear !== 'yes',
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Clear patient guidance minimizes administrative front-desk phone friction and reassuringly guides patients.',
    }),
  },
  {
    id: 'rec_cat_clinic_credentials',
    title: 'Publish Practitioner Credentials, Specializations & Insurance Coverage',
    category: 'Reviews and reputation',
    defaultPriority: 'High',
    summary:
      'Display medical qualifications, specialist registrations, accepted insurance networks, and payment options.',
    whyItMatters:
      'Patients verify clinician credentials and payment/insurance coverage before booking medical consultations.',
    problemAddressed:
      'Patients hesitate to choose unfamiliar healthcare providers when clinical experience and insurance networks are omitted.',
    expectedBenefit:
      'Immediate clinical authority, patient trust, and elimination of insurance compatibility billing surprises.',
    estimatedEffort: '45 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Doctor degrees, medical board numbers, list of accepted insurance plans.',
    instructions: [
      'List all attending doctors, therapists, or dentists with their verified degrees, licenses, and areas of special clinical interest.',
      'Provide an updated list of accepted health insurance providers or transparent self-pay pricing schedules.',
      'Mention clinic accessibility features (wheelchair access, elevator, language assistance).',
    ],
    suggestedTimeToComplete: 'Week 2',
    completionCriteria:
      'Doctor bios, accredited credentials, and insurance/payment lists are up to date on your website.',
    suggestedNextStep:
      'Add doctor names and specialty categories to your Google Business Profile provider listings.',
    tags: ['clinic', 'credentials', 'trust', 'insurance', 'free'],
    version: 2,
    defaultPriorityReason:
      'Trust and insurance compatibility are mandatory prerequisites in healthcare decision-making.',
    businessCategories: ['health_clinic'],
    targetGoals: ['trust_reviews', 'more_enquiries', 'local_visibility'],
    baseImpactScore: 9,
    baseEffortScore: 2,
    isApplicable: (a) =>
      a.category === 'health_clinic' && a.clinicCredentialsInsuranceClear !== 'yes',
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Builds foundational clinical trust and eliminates coverage billing questions upfront.',
    }),
  },

  // --- HOME SERVICES & TRADES ---
  {
    id: 'rec_cat_homeservice_servicearea',
    title: 'Define Explicit Service Areas, Suburbs & Travel Policies',
    category: 'Local SEO',
    defaultPriority: 'High',
    summary:
      'Explicitly specify every town, neighborhood, county, or postal code you travel to for trade and repair jobs.',
    whyItMatters:
      'Homeowners will not contact a tradesperson if they are unsure whether their neighborhood falls within the travel zone.',
    problemAddressed:
      'Uncertainty about service zones causes homeowners to call competitors who explicitly mention their town.',
    expectedBenefit:
      'Higher conversion from nearby homeowners and dramatic reduction in wasted out-of-area phone inquiries.',
    estimatedEffort: '40 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'List of target suburbs, towns, zip codes, and travel radius boundary.',
    instructions: [
      'Create a dedicated "Service Areas" section on your homepage and contact page listing key towns and suburbs.',
      'Configure your service area radius in Google Business Profile (choose cities and postal codes rather than distant regions).',
      'Explain travel policies clearly (e.g. "Free travel within 20km radius; minimal travel fee beyond").',
      'Add customer testimonials mentioning specific neighborhood names to reinforce local search relevance.',
    ],
    suggestedTimeToComplete: 'Week 1',
    completionCriteria:
      'Specific suburbs and service radius clearly defined on website and Google profile.',
    suggestedNextStep:
      'Include your top 3 target service areas in your website homepage meta description and footer.',
    tags: ['trades', 'home-services', 'service-area', 'local-seo', 'free'],
    version: 2,
    defaultPriorityReason:
      'Trade businesses rely on precise service radius clarity to filter out unqualified out-of-area calls.',
    businessCategories: ['home_trades'],
    targetGoals: ['local_visibility', 'more_enquiries'],
    baseImpactScore: 9,
    baseEffortScore: 2,
    isApplicable: (a) =>
      a.category === 'home_trades' && a.homeServiceAreaClarified !== 'yes',
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Guarantees prospective clients in your target service radius know you can come to their home.',
    }),
  },
  {
    id: 'rec_cat_homeservice_quoteform',
    title: 'Add a Quick-Response Quote Request & Photo Upload Option',
    category: 'Conversion improvements',
    defaultPriority: 'High',
    summary:
      'Allow homeowners to submit a quick estimate request with optional photo uploads of their repair or project.',
    whyItMatters:
      'Tradespeople spend significant time diagnosing basic issues over the phone; letting customers send photos streamlines quoting.',
    problemAddressed:
      'Homeowners struggle to describe technical plumbing, electrical, or roofing issues over the phone.',
    expectedBenefit:
      'Accurate job estimates before arrival, higher quote completion rate, and faster emergency job dispatch.',
    estimatedEffort: '35 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Simple 4-field web form or WhatsApp direct link with photo support.',
    instructions: [
      'Create a simple 4-field quote form: Name, Phone, Suburb/Address, and Problem Description.',
      'Offer an option to attach or WhatsApp 1–2 photos of the issue (e.g. leaking pipe, damaged drywall, electrical panel).',
      'Commit to a transparent response window (e.g., "We respond within 2 hours with an estimate").',
      'Place a prominent "Emergency Call" button if you offer 24/7 emergency repair response.',
    ],
    suggestedTimeToComplete: 'Week 2',
    completionCriteria:
      'Quick quote form with photo attachment or WhatsApp link is live on your website.',
    suggestedNextStep:
      'Test submitting a quote request to verify form notification emails reach your smartphone immediately.',
    tags: ['trades', 'quotes', 'leads', 'home-services', 'free'],
    version: 2,
    defaultPriorityReason:
      'Photo uploads accelerate estimate turnaround and increase quote request conversions by 40%.',
    businessCategories: ['home_trades'],
    targetGoals: ['more_enquiries', 'website_improvement'],
    baseImpactScore: 9,
    baseEffortScore: 2,
    isApplicable: (a) =>
      a.category === 'home_trades' &&
      a.homeServiceEmergencyOrQuoteForm !== 'yes',
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Simplifies estimate requests for busy homeowners seeking prompt trade assistance.',
    }),
  },

  // --- RETAIL & INDEPENDENT SHOPS ---
  {
    id: 'rec_cat_retail_showcase',
    title: 'Showcase Top In-Store Product Lines and Brands Online',
    category: 'Website basics',
    defaultPriority: 'High',
    summary:
      'Enable local shoppers to verify which product brands and key categories you stock in-store before visiting.',
    whyItMatters:
      'Local retail shoppers actively search online to see if nearby shops carry specific items before making the physical trip.',
    problemAddressed:
      'Shoppers assume a nearby store doesn’t carry what they need and order from online giants instead.',
    expectedBenefit:
      'Captures local shopping intent, drives foot traffic into the shop, and increases in-person basket sizes.',
    estimatedEffort: '45 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Top 5 brand names, product catalog highlights, Google Products editor.',
    instructions: [
      'List your top 5–10 best-selling product categories and exclusive brand names on your website homepage.',
      'Add photos of current in-store displays and merchandise to your Google Business Profile photo stream.',
      'Use the Google Business Profile "Products" feature to create free showcase cards with photos and price ranges.',
      'Highlight return policies, gift cards, and whether customers can call to hold an item for pickup.',
    ],
    suggestedTimeToComplete: 'Week 1',
    referenceUrl: 'https://support.google.com/business/answer/9949704',
    referenceTitle: 'Google Business Profile Products Editor',
    completionCriteria:
      'Top 5 product lines highlighted on your website and populated in Google Products editor.',
    suggestedNextStep:
      'Add 3 seasonal showcase products to your Google listing at the start of each month.',
    tags: ['retail', 'products', 'inventory', 'storefront', 'free'],
    version: 2,
    defaultPriorityReason:
      'Drives physical in-store foot traffic by validating product availability beforehand.',
    businessCategories: ['retail'],
    targetGoals: ['more_visits', 'local_visibility'],
    baseImpactScore: 9,
    baseEffortScore: 2,
    isApplicable: (a) =>
      a.category === 'retail' && a.retailProductDiscoveryOnline !== 'yes',
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Converts online searchers into brick-and-mortar foot traffic by demonstrating relevant inventory.',
    }),
  },
  {
    id: 'rec_cat_retail_hours_parking',
    title: 'Highlight Store Hours, Parking Notes & Pickup Convenience',
    category: 'Conversion improvements',
    defaultPriority: 'High',
    summary:
      'Provide clear street navigation, nearby parking spots, and curbside or in-store pickup options.',
    whyItMatters:
      'Parking friction and unverified opening hours are the leading reasons local retail shoppers abandon visiting stores.',
    problemAddressed:
      'Shoppers fear arriving to closed doors or cannot figure out where to park, opting for shopping malls instead.',
    expectedBenefit:
      'Confident shopper arrivals, hassle-free navigation, and higher weekend in-store visitor counts.',
    estimatedEffort: '25 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Exact holiday hours schedule, nearest parking lot directions.',
    instructions: [
      'Publish exact weekday and weekend operating hours, including any early closures or holiday schedules.',
      'Give clear parking advice (e.g., "Free 2-hour parking on Main St or behind the building in municipal lot").',
      'Explain in-store pickup procedures if customers wish to reserve items by phone or message.',
    ],
    suggestedTimeToComplete: 'Week 2',
    completionCriteria:
      'Store hours, holiday schedule, and parking directions are clearly visible on website and map listing.',
    suggestedNextStep:
      'Check that your Google listing displays special holiday hours at least one week in advance.',
    tags: ['retail', 'parking', 'hours', 'storefront', 'free'],
    version: 2,
    defaultPriorityReason:
      'Removes visit friction so local shoppers can easily access your physical store.',
    businessCategories: ['retail'],
    targetGoals: ['more_visits', 'local_visibility'],
    baseImpactScore: 8,
    baseEffortScore: 1,
    isApplicable: (a) =>
      a.category === 'retail' && a.retailStoreHoursParkingClear !== 'yes',
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Assures customers your doors are open and parking is hassle-free before they drive over.',
    }),
  },

  // --- PROFESSIONAL & OFFICE SERVICES ---
  {
    id: 'rec_cat_professional_consultation',
    title: 'Offer a Clear Initial Consultation & Case Summary Overview',
    category: 'Conversion improvements',
    defaultPriority: 'High',
    summary:
      'Define your consultation process, typical engagement scope, and client onboarding roadmap.',
    whyItMatters:
      'Prospective clients evaluating accountants, lawyers, designers, or consultants need to know what to expect in the initial meeting.',
    problemAddressed:
      'Prospective clients fear high unknown hourly billing rates or unstructured initial consultations.',
    expectedBenefit:
      'Higher qualified consultation requests, framed expectations, and faster signed client agreements.',
    estimatedEffort: '45 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Consultation agenda description, 2 client proof summaries.',
    instructions: [
      'Outline what happens during your introductory consultation (duration, format: video/in-person, and preparation required).',
      'Add 2–3 brief case studies or client problem/solution examples that demonstrate tangible results.',
      'Provide an easy consultation request form with preferred meeting dates and times.',
    ],
    suggestedTimeToComplete: 'Week 2',
    completionCriteria:
      'Consultation overview and client results examples are published on website.',
    suggestedNextStep:
      'Link your calendar booking tool directly to the consultation button on your contact page.',
    tags: ['professional', 'consulting', 'b2b', 'leads', 'free'],
    version: 2,
    defaultPriorityReason:
      'De-risks the first step for prospective high-value professional clients.',
    businessCategories: ['professional_services'],
    targetGoals: ['more_enquiries', 'trust_reviews'],
    baseImpactScore: 9,
    baseEffortScore: 3,
    isApplicable: (a) =>
      a.category === 'professional_services' &&
      a.professionalInitialConsultationOffer !== 'yes',
    evaluatePriority: () => ({
      priority: 'High',
      reason:
        'Clarifies your working method and motivates serious inquiries to initiate contact.',
    }),
  },

  // --- FITNESS & SPORTS STUDIOS ---
  {
    id: 'rec_cat_fitness_trial',
    title: 'Launch a Visible "First Class Free" or Intro Week Pass',
    category: 'Customer acquisition',
    defaultPriority: 'High',
    summary:
      'Offer a frictionless, low-commitment trial pass so newcomers can experience your studio coaching without long contracts.',
    whyItMatters:
      'Fitness prospects feel intimidating friction before visiting a gym or yoga studio for the first time. An intro pass removes fear.',
    problemAddressed:
      'Prospective members hesitate to commit to monthly gym dues without trying the equipment or coaching style first.',
    expectedBenefit:
      'Consistent stream of new walk-in trial members, 50%+ conversion to recurring monthly memberships.',
    estimatedEffort: '35 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Intro pass price/offer details, booking link or claim form.',
    instructions: [
      'Create an introductory offer (e.g., "$19 for 7 Days Unlimited" or "Free First Class Pass").',
      'Place a prominent "Claim Your Intro Pass" button in your website header and Instagram bio.',
      'Provide clear instructions on what to bring (workout shoes, water bottle, towel).',
      'Follow up by text or email 24 hours after their first session to invite them to a regular membership plan.',
    ],
    suggestedTimeToComplete: 'Week 1',
    completionCriteria: 'Introductory trial pass clearly featured with 1-click booking on website and social bio.',
    suggestedNextStep: 'Train coaches to warmly greet trial pass holders and introduce them to the workout floor.',
    tags: ['fitness', 'trial', 'intro-pass', 'acquisition'],
    version: 2,
    defaultPriorityReason: 'The #1 conversion catalyst for boutique fitness studios, gyms, and martial arts academies.',
    businessCategories: ['fitness'],
    targetGoals: ['more_bookings', 'more_visits', 'more_enquiries'],
    baseImpactScore: 10,
    baseEffortScore: 2,
    isApplicable: (a) => a.category === 'fitness',
    evaluatePriority: () => ({
      priority: 'High',
      reason: 'Lowers signup barrier: Intro passes convert hesitant prospects into enthusiastic regulars.',
    }),
  },
  {
    id: 'rec_cat_fitness_schedule',
    title: 'Publish a Mobile-Accessible Class Schedule & Instructor Bios',
    category: 'Website basics',
    defaultPriority: 'High',
    summary:
      'Display daily workout schedules, intensity levels, and trainer credentials prominently on your website and profiles.',
    whyItMatters:
      'Studio members plan their workouts around specific class times and instructors. Missing schedules force them to look elsewhere.',
    problemAddressed:
      'Members cannot tell which classes run on which days or whether sessions fit their work commute schedule.',
    expectedBenefit:
      'Increased class attendance, fewer repetitive schedule inquiries, and higher member satisfaction.',
    estimatedEffort: '40 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Class timetable, session descriptions, instructor photos.',
    instructions: [
      'Publish a mobile-responsive weekly timetable showing class times, workout styles, and coaching staff.',
      'Tag intensity ratings (e.g., Beginner-Friendly, Intermediate, High-Intensity) so members choose appropriate classes.',
      'Sync the booking link directly to each timetable row.',
    ],
    suggestedTimeToComplete: 'Week 2',
    completionCriteria: 'Weekly timetable is live and verified on a smartphone screen without horizontal cutoff.',
    suggestedNextStep: 'Highlight any new morning or weekend classes on your Instagram stories.',
    tags: ['fitness', 'schedule', 'classes', 'trainers'],
    version: 2,
    defaultPriorityReason: 'Essential operational information that dictates whether local residents can attend.',
    businessCategories: ['fitness'],
    targetGoals: ['more_bookings', 'website_improvement'],
    baseImpactScore: 8,
    baseEffortScore: 2,
    isApplicable: (a) => a.category === 'fitness',
    evaluatePriority: () => ({
      priority: 'High',
      reason: 'Direct scheduling clarity drives instant class registration.',
    }),
  },
  {
    id: 'rec_cat_fitness_referral',
    title: 'Implement a Member Referral "Workout Buddy" Credit Program',
    category: 'Customer retention',
    defaultPriority: 'Medium',
    summary:
      'Reward existing members with membership discounts or studio apparel when they bring a friend who joins.',
    whyItMatters:
      'People who work out with friends retain their memberships 40% longer and create high-retention community bonds.',
    problemAddressed:
      'Gym member churn after the first 90 days due to lack of social accountability.',
    expectedBenefit:
      'Zero-ad-spend member acquisition and substantially reduced monthly membership cancellation rates.',
    estimatedEffort: '30 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Referral reward terms (e.g., $25 dues credit for member and friend).',
    instructions: [
      'Define a clear referral perk (e.g. "Bring a workout partner: they get 50% off month 1, and you get a $25 credit").',
      'Announce the program on studio noticeboards, email newsletters, and during class announcements.',
      'Celebrate new member buddy pairs on your community board.',
    ],
    suggestedTimeToComplete: 'Week 3',
    completionCriteria: 'Referral program guidelines published on studio bulletin board and emailed to current members.',
    suggestedNextStep: 'Offer a "Free Bring a Friend Friday" once a month to spur trial visits.',
    tags: ['fitness', 'retention', 'referrals', 'community'],
    version: 2,
    defaultPriorityReason: 'Social accountability is the single highest predictor of fitness member retention.',
    businessCategories: ['fitness'],
    targetGoals: ['customer_retention', 'more_visits'],
    baseImpactScore: 8,
    baseEffortScore: 2,
    isApplicable: (a) => a.category === 'fitness',
    evaluatePriority: () => ({
      priority: 'Medium',
      reason: 'Keeps members accountable and systematically acquires new members through trusted friendships.',
    }),
  },

  // --- GENERAL COMMUNITY & SCHEMA ENHANCEMENTS ---
  {
    id: 'rec_gbp_attributes_photos',
    title: 'Add Verified Amenities, Payment Methods & Real Photos to Google Profile',
    category: 'Google Business Profile',
    defaultPriority: 'Medium',
    summary:
      'Complete all category-specific attributes (Wi-Fi, parking, card payments, accessibility) and refresh photo uploads.',
    whyItMatters:
      'Businesses with complete attributes and regular photo uploads receive 42% more requests for driving directions.',
    problemAddressed:
      'Google filters out businesses in categorical searches when specific attributes (like wheelchair accessible or credit card accepted) are unset.',
    expectedBenefit:
      'Inclusion in filtered map searches, higher click-through rates, and visually appealing profile cards.',
    estimatedEffort: '30 mins',
    difficultyLevel: 'Beginner',
    requiredResources: 'Smartphone camera, 5 fresh photos of storefront and team.',
    instructions: [
      'Open your Google Business Profile dashboard and click "Edit profile" -> "More" -> "Attributes".',
      'Toggle all accurate features: payment options, accessibility, amenities, and service highlights.',
      'Upload 5 fresh, high-resolution photos showing your clean facilities, team at work, and happy clients.',
    ],
    suggestedTimeToComplete: 'Week 2',
    completionCriteria: 'At least 8 profile attributes confirmed and 5 fresh photos uploaded.',
    suggestedNextStep: 'Schedule a recurring calendar check to upload 2 new photos every month.',
    tags: ['google', 'gbp', 'attributes', 'photos', 'free'],
    version: 2,
    defaultPriorityReason: 'Maximizes search filter appearances and presents an inviting visual presence.',
    businessCategories: 'all',
    targetGoals: ['local_visibility', 'trust_reviews'],
    baseImpactScore: 7,
    baseEffortScore: 2,
    isApplicable: (a) => a.businessModel !== 'online_only',
    evaluatePriority: () => ({
      priority: 'Medium',
      reason: 'Deepens your profile credibility and ensures you appear in filtered map searches.',
    }),
  },
  {
    id: 'rec_local_schema',
    title: 'Add LocalBusiness Schema to Your Website',
    category: 'Local SEO',
    defaultPriority: 'Low',
    summary:
      'Add structured JSON-LD code to your website so search crawlers unambiguously understand your opening hours, phone, and address.',
    whyItMatters:
      'Structured data feeds Google Knowledge Graph, rich search snippets, and voice assistants with verified business details.',
    problemAddressed:
      'Search crawlers have to guess your business hours, address, and geo-coordinates from unstructured HTML.',
    expectedBenefit:
      'Eligible for rich snippets in Google search results, voice search indexing, and cleaner crawl accuracy.',
    estimatedEffort: '30–45 mins',
    difficultyLevel: 'Intermediate',
    requiredResources: 'Free JSON-LD schema generator, website code/CMS access.',
    instructions: [
      'Generate a free LocalBusiness JSON-LD snippet matching your verified Google Business Profile details.',
      'Include your business type, name, telephone, street address, and opening hours specification.',
      'Embed the snippet in the `<head>` of your website homepage.',
      'Test your page URL using Google’s free Rich Results Test tool to verify zero errors.',
    ],
    suggestedTimeToComplete: 'Week 4',
    referenceUrl:
      'https://developers.google.com/search/docs/appearance/structured-data/local-businesses',
    referenceTitle: 'Google Search Central LocalBusiness Schema Guide',
    completionCriteria:
      'JSON-LD schema passes Google Rich Results test with no errors.',
    suggestedNextStep:
      'Validate your homepage with Google Rich Results test to confirm detection.',
    tags: ['schema', 'technical-seo', 'json-ld', 'advanced', 'free'],
    version: 2,
    defaultPriorityReason:
      'Technical enhancement: Best implemented after your basic contact info and website content are verified.',
    businessCategories: 'all',
    targetGoals: ['local_visibility', 'website_improvement'],
    baseImpactScore: 6,
    baseEffortScore: 4,
    isApplicable: (a) => a.hasWebsite === 'yes',
    evaluatePriority: (a) => ({
      priority: a.weeklyHours === 'over_5h' ? 'Medium' : 'Low',
      reason:
        'Refines your search technical foundation once primary listings and reviews are active.',
    }),
  },
  {
    id: 'rec_cross_promotion',
    title: 'Partner with 2 Complementary Non-Competing Local Businesses',
    category: 'Customer acquisition',
    defaultPriority: 'Low',
    summary:
      'Identify nearby businesses serving the same clientele and agree on a mutual shout-out or bulletin board feature.',
    whyItMatters:
      'Leverages established neighborhood trust and opens access to ready-made local customer networks for zero ad spend.',
    problemAddressed:
      'Relying solely on digital algorithms while ignoring immediate neighboring businesses with identical customer bases.',
    expectedBenefit:
      'High-trust local customer referrals, neighborhood goodwill, and cross-pollination of loyal patrons.',
    estimatedEffort: '1 hour',
    difficultyLevel: 'Beginner',
    requiredResources: 'Flyers or mutual social post agreement with local neighbors.',
    instructions: [
      'List 3 businesses nearby that share your target audience (e.g. coffee shop + yoga studio, wedding florist + local photographer).',
      'Visit the owner or manager in person with a friendly proposal.',
      'Offer to feature their service in an email or social post in exchange for a reciprocal mention or brochure exchange.',
      'Document results in your inquiry log.',
    ],
    suggestedTimeToComplete: 'Week 4',
    completionCriteria:
      'At least 1 mutual cross-promotion or referral relationship confirmed.',
    suggestedNextStep:
      'Introduce yourself to two neighboring business owners on your block this week.',
    tags: ['partnerships', 'referrals', 'community', 'free'],
    version: 2,
    defaultPriorityReason:
      'Builds organic local word-of-mouth with zero software or ad costs.',
    businessCategories: 'all',
    targetGoals: ['customer_retention', 'local_visibility', 'more_visits'],
    baseImpactScore: 6,
    baseEffortScore: 3,
    isApplicable: (a) =>
      a.budgetPreference === 'free_only' || a.budgetPreference === 'mostly_free',
    evaluatePriority: () => ({
      priority: 'Low',
      reason:
        'Great organic grassroots tactic to undertake once digital foundations are stable.',
    }),
  },
];
