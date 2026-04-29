import { describe, expect, it } from 'vitest';
import { filterMarketplaceBlobs, sortMarketplaceBlobs } from './marketplaceFilters';
import type { MarketplaceBlob } from './demoData';

const blobs: MarketplaceBlob[] = [
  { owner: '0x1', name: 'mobility/a.parquet', title: 'Jakarta mobility', description: 'Transport demand', size: '84 MB', category: 'Mobility', updated: '2h ago', downloads: 128, price: '0.1 ShelbyUSD' },
  { owner: '0x2', name: 'energy/b.csv', title: 'Grid load', description: 'Energy anomaly', size: '31 MB', category: 'Energy', updated: '6h ago', downloads: 87, price: 'Free testnet' },
  { owner: '0x3', name: 'health/c.jsonl', title: 'Vitals benchmark', description: 'Healthcare rows', size: '12 MB', category: 'Health', updated: '1d ago', downloads: 203, price: '0.05 ShelbyUSD' },
];

describe('marketplace filters', () => {
  it('searches title description category and path case-insensitively', () => {
    expect(filterMarketplaceBlobs(blobs, { query: 'grid', category: 'All', price: 'All' }).map((b) => b.name)).toEqual(['energy/b.csv']);
    expect(filterMarketplaceBlobs(blobs, { query: 'JAKARTA', category: 'All', price: 'All' }).map((b) => b.name)).toEqual(['mobility/a.parquet']);
  });

  it('filters by category and free/paid price', () => {
    expect(filterMarketplaceBlobs(blobs, { query: '', category: 'Health', price: 'Paid' }).map((b) => b.name)).toEqual(['health/c.jsonl']);
    expect(filterMarketplaceBlobs(blobs, { query: '', category: 'All', price: 'Free' }).map((b) => b.name)).toEqual(['energy/b.csv']);
  });

  it('sorts by popularity and price', () => {
    expect(sortMarketplaceBlobs(blobs, 'Most popular').map((b) => b.name)).toEqual(['health/c.jsonl', 'mobility/a.parquet', 'energy/b.csv']);
    expect(sortMarketplaceBlobs(blobs, 'Lowest price').map((b) => b.name)).toEqual(['energy/b.csv', 'health/c.jsonl', 'mobility/a.parquet']);
  });
});
