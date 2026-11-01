import test from 'node:test';
import assert from 'node:assert';
import { THEME_STORAGE_KEY } from './theme';

test('theme: storage key matches requirement exactly', () => {
  assert.strictEqual(THEME_STORAGE_KEY, 'local-business-growth-planner-theme');
});
