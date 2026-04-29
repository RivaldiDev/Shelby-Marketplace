export type MarketplaceBlob = {
  owner: string;
  name: string;
  title: string;
  description: string;
  size: string;
  category: string;
  updated: string;
  downloads: number;
  price: string;
};

export const featuredBlobs: MarketplaceBlob[] = [
  {
    owner: '0x9f4c...7a11',
    name: 'mobility/demand-signals.parquet',
    title: 'Jakarta Mobility Demand Signals',
    description: 'Curated transport demand indicators prepared for mobility analysis and route planning.',
    size: '84 MB',
    category: 'Mobility',
    updated: '2h ago',
    downloads: 128,
    price: '0.10 ShelbyUSD',
  },
  {
    owner: '0x3b91...a4e0',
    name: 'energy/grid-load.csv',
    title: 'Grid Load Anomaly Dataset',
    description: 'Time-series load events enriched with weather context and sensor confidence scores.',
    size: '31 MB',
    category: 'Energy',
    updated: '6h ago',
    downloads: 87,
    price: 'Free access',
  },
  {
    owner: '0x72aa...d8c2',
    name: 'health/public-vitals.jsonl',
    title: 'Public Vitals Benchmark',
    description: 'De-identified vitals records structured for healthcare model evaluation workflows.',
    size: '12 MB',
    category: 'Health',
    updated: '1d ago',
    downloads: 203,
    price: '0.05 ShelbyUSD',
  },
  {
    owner: '0x44d2...910b',
    name: 'finance/merchant-risk.csv',
    title: 'Merchant Risk Feature Set',
    description: 'Aggregated transaction risk indicators prepared for fraud detection experiments.',
    size: '46 MB',
    category: 'Finance',
    updated: '3h ago',
    downloads: 61,
    price: '0.25 ShelbyUSD',
  },
  {
    owner: '0x82be...52af',
    name: 'climate/rainfall-tiles.zarr',
    title: 'Rainfall Tile Archive',
    description: 'Regional climate tiles with rainfall intensity, timestamps, and geospatial bands.',
    size: '196 MB',
    category: 'Climate',
    updated: '12h ago',
    downloads: 44,
    price: '0.15 ShelbyUSD',
  },
  {
    owner: '0x15aa...ee90',
    name: 'retail/shelf-events.json',
    title: 'Retail Shelf Event Stream',
    description: 'Shelf availability events structured for retail analytics and inventory monitoring.',
    size: '22 MB',
    category: 'Retail',
    updated: '2d ago',
    downloads: 99,
    price: 'Free access',
  },
];

export function blobDownloadUrl(owner: string, name: string) {
  return `https://api.testnet.shelby.xyz/shelby/v1/blobs/${owner}/${encodeURIComponent(name)}`;
}
