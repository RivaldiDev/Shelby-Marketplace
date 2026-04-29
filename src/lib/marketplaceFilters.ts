import type { MarketplaceBlob } from './demoData';

export type MarketplacePriceFilter = 'All' | 'Free' | 'Paid';
export type MarketplaceSort = 'Newest' | 'Most popular' | 'Lowest price' | 'Highest price';

export type MarketplaceFilterState = {
  query: string;
  category: string;
  price: MarketplacePriceFilter;
};

export function parsePriceValue(price: string): number {
  const normalized = price.toLowerCase();
  if (normalized.includes('free')) return 0;
  const match = normalized.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

export function isPaidBlob(blob: MarketplaceBlob): boolean {
  return parsePriceValue(blob.price) > 0;
}

export function filterMarketplaceBlobs(blobs: MarketplaceBlob[], filters: MarketplaceFilterState): MarketplaceBlob[] {
  const query = filters.query.trim().toLowerCase();
  return blobs.filter((blob) => {
    const haystack = [blob.title, blob.description, blob.category, blob.owner, blob.name, blob.price].join(' ').toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesCategory = filters.category === 'All' || blob.category === filters.category;
    const matchesPrice = filters.price === 'All' || (filters.price === 'Paid' ? isPaidBlob(blob) : !isPaidBlob(blob));
    return matchesQuery && matchesCategory && matchesPrice;
  });
}

export function sortMarketplaceBlobs(blobs: MarketplaceBlob[], sort: MarketplaceSort): MarketplaceBlob[] {
  return [...blobs].sort((a, b) => {
    if (sort === 'Most popular') return b.downloads - a.downloads;
    if (sort === 'Lowest price') return parsePriceValue(a.price) - parsePriceValue(b.price);
    if (sort === 'Highest price') return parsePriceValue(b.price) - parsePriceValue(a.price);
    return 0;
  });
}

export function getMarketplaceCategories(blobs: MarketplaceBlob[]): string[] {
  return ['All', ...Array.from(new Set(blobs.map((blob) => blob.category))).sort()];
}
