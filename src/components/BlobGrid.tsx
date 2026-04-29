import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Download, ExternalLink, Search, SlidersHorizontal, X } from 'lucide-react';
import { blobDownloadUrl, featuredBlobs, type MarketplaceBlob } from '../lib/demoData';
import {
  filterMarketplaceBlobs,
  getMarketplaceCategories,
  sortMarketplaceBlobs,
  type MarketplacePriceFilter,
  type MarketplaceSort,
} from '../lib/marketplaceFilters';

const priceOptions: MarketplacePriceFilter[] = ['All', 'Free', 'Paid'];
const sortOptions: MarketplaceSort[] = ['Newest', 'Most popular', 'Lowest price', 'Highest price'];

export default function BlobGrid({ blobs = featuredBlobs }: { blobs?: MarketplaceBlob[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [price, setPrice] = useState<MarketplacePriceFilter>('All');
  const [sort, setSort] = useState<MarketplaceSort>('Newest');
  const categories = useMemo(() => getMarketplaceCategories(blobs), [blobs]);
  const filtered = useMemo(
    () => sortMarketplaceBlobs(filterMarketplaceBlobs(blobs, { query, category, price }), sort),
    [blobs, query, category, price, sort],
  );
  const hasFilters = query || category !== 'All' || price !== 'All' || sort !== 'Newest';

  function resetFilters() {
    setQuery('');
    setCategory('All');
    setPrice('All');
    setSort('Newest');
  }

  return (
    <div className="marketplace-shell">
      <aside className="market-sidebar card glow">
        <span className="badge"><SlidersHorizontal size={14} /> Refine catalog</span>
        <div className="filter-block">
          <label className="field-label" htmlFor="category-filter">Category</label>
          <select id="category-filter" className="input" value={category} onChange={(e) => setCategory(e.currentTarget.value)}>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="filter-block">
          <span className="field-label">Price</span>
          <div className="chip-row">
            {priceOptions.map((item) => (
              <button key={item} className={`filter-chip ${price === item ? 'active' : ''}`} onClick={() => setPrice(item)}>{item}</button>
            ))}
          </div>
        </div>
        <div className="filter-block">
          <label className="field-label" htmlFor="sort-filter">Sort</label>
          <select id="sort-filter" className="input" value={sort} onChange={(e) => setSort(e.currentTarget.value as MarketplaceSort)}>
            {sortOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        {hasFilters && <button className="btn" onClick={resetFilters}><X size={15} /> Clear selection</button>}
      </aside>

      <section className="market-content">
        <div className="market-toolbar card">
          <div className="search-box">
            <Search size={18} />
            <input value={query} onChange={(e) => setQuery(e.currentTarget.value)} placeholder="Search assets, owners, or categories..." />
          </div>
          <div className="result-count"><strong>{filtered.length}</strong><span>assets</span></div>
        </div>

        {filtered.length === 0 ? (
          <div className="card empty-state">
            <h3>No assets found</h3>
            <p>Adjust your search or filters to view more marketplace assets.</p>
            <button className="btn primary" onClick={resetFilters}>Reset catalog</button>
          </div>
        ) : (
          <div className="grid cards marketplace-grid">
            {filtered.map((blob, index) => (
              <motion.article
                className="card glow market-card"
                key={`${blob.owner}-${blob.name}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.04, 0.2) }}
              >
                <div className="product-topline">
                  <span className="badge"><Database size={14} /> {blob.category}</span>
                  <strong className={blob.price.toLowerCase().includes('free') ? 'price-pill free' : 'price-pill'}>{blob.price}</strong>
                </div>
                <h3>{blob.title}</h3>
                <p>{blob.description}</p>
                <div className="kpis product-kpis">
                  <div className="kpi"><strong>{blob.size}</strong><span>Size</span></div>
                  <div className="kpi"><strong>{blob.downloads}</strong><span>Downloads</span></div>
                  <div className="kpi"><strong>{blob.updated}</strong><span>Updated</span></div>
                </div>
                <p className="code">{blob.owner}/{blob.name}</p>
                <div className="actions">
                  <a className="btn primary" href={blobDownloadUrl(blob.owner, blob.name)} target="_blank"><Download size={16}/> {blob.price.toLowerCase().includes('free') ? 'Open asset' : 'Request access'}</a>
                  <a className="btn" href={`/blob/${blob.owner}/${encodeURIComponent(blob.name)}`}><ExternalLink size={16}/> View details</a>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
