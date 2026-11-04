import { safeFetchHtml } from '../../server/seoScraper.js';

export default async function handler(req: any, res: any) {
  // Allow CORS if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'A valid website URL string is required.' });
    }

    const scrapeResult = await safeFetchHtml(url);
    return res.status(200).json({
      success: true,
      scrapeResult,
    });
  } catch (err: any) {
    const errorMessage = err?.message || (typeof err === 'string' ? err : 'Failed to crawl target website.');
    return res.status(400).json({
      error: errorMessage,
    });
  }
}
