import { describe, expect, it } from 'vitest';
import { priceShelbyUsdToBaseUnits, normalizeMonetizationMode } from './monetization';

describe('monetization helpers', () => {
  it('converts ShelbyUSD display price to base units with 6-decimal minimum support', () => {
    expect(priceShelbyUsdToBaseUnits('0')).toBe(0);
    expect(priceShelbyUsdToBaseUnits('0.000001')).toBe(100);
    expect(priceShelbyUsdToBaseUnits('0.1')).toBe(10_000_000);
    expect(priceShelbyUsdToBaseUnits('1')).toBe(100_000_000);
  });

  it('rejects prices below Shelby purchasable minimum', () => {
    expect(() => priceShelbyUsdToBaseUnits('0.0000001')).toThrow(/minimum/i);
    expect(() => priceShelbyUsdToBaseUnits('-1')).toThrow(/invalid/i);
  });

  it('maps zero price to public and positive price to purchasable', () => {
    expect(normalizeMonetizationMode(0)).toBe('public');
    expect(normalizeMonetizationMode(100)).toBe('purchasable');
  });
});
