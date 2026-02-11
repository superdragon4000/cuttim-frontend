import {describe, expect, it} from 'vitest';
import {cn} from './cn';

describe('cn', () => {
  it('joins truthy classes', () => {
    expect(cn('a', undefined, false, 'b')).toBe('a b');
  });
});
