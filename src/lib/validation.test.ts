import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeText, normalizeUrl, validateStep1, validateStep2 } from './validation';

test('validation: sanitizeText escapes html tags and quotes', () => {
  const unsafe = '<script>alert("xss")</script> & Bakery';
  const clean = sanitizeText(unsafe);
  assert.equal(clean.includes('<script>'), false);
  assert.equal(clean.includes('alert'), true);
  assert.equal(clean.includes('&'), true);
});

test('validation: normalizeUrl prepends https and cleans paths', () => {
  const res1 = normalizeUrl('mybakery.com');
  assert.equal(res1.valid, true);
  assert.equal(res1.normalizedUrl, 'https://mybakery.com');

  const res2 = normalizeUrl('https://mybakery.com/menu/');
  assert.equal(res2.valid, true);
  assert.equal(res2.normalizedUrl, 'https://mybakery.com/menu');

  const res3 = normalizeUrl('not-a-valid-domain');
  assert.equal(res3.valid, false);
});

test('validation: validateStep1 detects missing required fields', () => {
  const errors = validateStep1({});
  assert.ok(errors.some((e) => e.field === 'category'));
  assert.ok(errors.some((e) => e.field === 'country'));
  assert.ok(errors.some((e) => e.field === 'cityArea'));
  assert.ok(errors.some((e) => e.field === 'businessModel'));
});

test('validation: validateStep2 detects invalid website URL when provided', () => {
  const errors = validateStep2({
    hasWebsite: 'yes',
    websiteUrl: 'invalid..url',
    hasBusinessListing: 'yes',
    socialPresence: 'one',
  });
  assert.ok(errors.some((e) => e.field === 'websiteUrl'));
});
