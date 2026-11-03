import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MarkdownRenderer } from './MarkdownRenderer';

describe('MarkdownRenderer Component', () => {
  it('renders bold and italic text properly without raw markdown symbols', () => {
    const raw = '**Local SEO & Google Business Profile**: Improve your *local visibility*.';
    const html = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: raw }));

    assert.ok(html.includes('Local SEO &amp; Google Business Profile') || html.includes('Local SEO & Google Business Profile'));
    assert.ok(html.includes('<strong') && html.includes('</strong>'));
    assert.ok(html.includes('<em') && html.includes('</em>'));
    assert.ok(!html.includes('**Local SEO'));
    assert.ok(!html.includes('*local visibility*'));
  });

  it('renders strikethrough via GFM', () => {
    const raw = 'We no longer recommend ~~generic flyer distribution~~ for dentists.';
    const html = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: raw }));

    assert.ok(html.includes('<del') || html.includes('<s'));
    assert.ok(html.includes('generic flyer distribution'));
    assert.ok(!html.includes('~~generic flyer'));
  });

  it('renders Headings with clean hierarchy (H1, H2, H3)', () => {
    const raw = '# Growth Plan\n## Core Foundations\n### Recommended Actions';
    const html = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: raw }));

    assert.ok(html.includes('<h1'));
    assert.ok(html.includes('Growth Plan</h1>'));
    assert.ok(html.includes('<h2'));
    assert.ok(html.includes('Core Foundations</h2>'));
    assert.ok(html.includes('<h3'));
    assert.ok(html.includes('Recommended Actions</h3>'));
  });

  it('renders unordered bullet lists and nested lists correctly', () => {
    const raw = `- Website improvement\n- Social media\n  - Instagram reels\n  - Facebook groups\n- Customer reviews`;
    const html = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: raw }));

    assert.ok(html.includes('<ul'));
    assert.ok(html.includes('<li'));
    assert.ok(html.includes('Website improvement'));
    assert.ok(html.includes('Instagram reels'));
    assert.ok(html.includes('Customer reviews'));
  });

  it('renders ordered numbered lists correctly', () => {
    const raw = `1. Review your website.\n2. Improve your homepage.\n3. Test the contact form.`;
    const html = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: raw }));

    assert.ok(html.includes('<ol'));
    assert.ok(html.includes('<li'));
    assert.ok(html.includes('Review your website.'));
    assert.ok(html.includes('Improve your homepage.'));
    assert.ok(html.includes('Test the contact form.'));
  });

  it('renders inline code and fenced code blocks properly', () => {
    const raw = 'Run the command `npm run build` to verify production assets.\n\n```bash\nnpm test\n```';
    const html = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: raw }));

    assert.ok(html.includes('<code'));
    assert.ok(html.includes('npm run build</code>'));
    assert.ok(html.includes('<pre'));
    assert.ok(html.includes('npm test'));
    assert.ok(!html.includes('```bash'));
  });

  it('renders safe external links with target="_blank" and rel="noopener noreferrer"', () => {
    const raw = 'Visit [TapGrow Documentation](https://tapgrow.example.com/docs) for guides.';
    const html = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: raw }));

    assert.ok(html.includes('<a'));
    assert.ok(html.includes('href="https://tapgrow.example.com/docs"'));
    assert.ok(html.includes('target="_blank"'));
    assert.ok(html.includes('rel="noopener noreferrer"'));
    assert.ok(html.includes('TapGrow Documentation</a>'));
  });

  it('renders blockquotes with styled quotation container', () => {
    const raw = '> "Focus on customer retention and Google reviews before spending on paid ads."';
    const html = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: raw }));

    assert.ok(html.includes('<blockquote'));
    assert.ok(html.includes('Focus on customer retention'));
  });

  it('renders responsive Markdown tables with thead and tbody', () => {
    const raw = `| Channel | Primary Audience | Expected ROI |
| --- | --- | --- |
| Google Maps | High-intent local searches | Immediate & Compounding |
| Website CTA | Existing visitors | High |
| Paid Social | General awareness | Moderate |`;
    const html = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: raw }));

    assert.ok(html.includes('<table'));
    assert.ok(html.includes('<thead'));
    assert.ok(html.includes('<th'));
    assert.ok(html.includes('<tbody'));
    assert.ok(html.includes('<td'));
    assert.ok(html.includes('Google Maps'));
    assert.ok(html.includes('Immediate &amp; Compounding') || html.includes('Immediate & Compounding'));
  });

  it('security: strips unsafe scripts and malicious javascript: links', () => {
    const rawWithScript = 'Hello <script>alert("xss")</script> **World**';
    const htmlScript = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: rawWithScript }));
    assert.ok(!htmlScript.includes('<script>'));
    assert.ok(!htmlScript.includes('alert("xss")'));

    const rawWithJsHref = '[Click here](javascript:alert("pwned"))';
    const htmlHref = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: rawWithJsHref }));
    // In rehype-sanitize, javascript: protocol is completely stripped
    assert.ok(!htmlHref.includes('href="javascript:'));
  });

  it('handles multi-paragraph responses and whitespace properly', () => {
    const raw = `First paragraph addressing local SEO for your business.\n\nSecond paragraph outlining Google Business Profile optimization.\n\nThird paragraph summarizing next actions.`;
    const html = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: raw }));

    assert.ok(html.includes('<p'));
    assert.ok(html.includes('First paragraph'));
    assert.ok(html.includes('Second paragraph'));
    assert.ok(html.includes('Third paragraph'));
  });
});
