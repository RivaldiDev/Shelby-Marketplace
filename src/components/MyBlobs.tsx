import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { RefreshCcw } from 'lucide-react';
import { listAccountBlobs } from '../lib/shelby';

type AnyBlob = Record<string, unknown>;

export default function MyBlobs() {
  const { connected, account } = useWallet();
  const [blobs, setBlobs] = useState<AnyBlob[]>([]);
  const [status, setStatus] = useState('Connect a wallet to view your published assets.');
  const [busy, setBusy] = useState(false);

  async function loadBlobs() {
    if (!account?.address) return;
    setBusy(true);
    setStatus('Loading published assets from the Shelby indexer...');
    try {
      const items = await listAccountBlobs(account.address.toString());
      setBlobs(items as unknown as AnyBlob[]);
      setStatus(`${items.length} published asset${items.length === 1 ? '' : 's'} available.`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card glow">
      <div style={{ display:'flex', justifyContent:'space-between', gap:12, flexWrap:'wrap', alignItems:'center' }}>
        <div><span className="badge">Publisher dashboard</span><h2>My published assets</h2><p>{status}</p></div>
        <button className="btn primary" disabled={!connected || busy} onClick={loadBlobs}><RefreshCcw size={16}/> Load assets</button>
      </div>
      <div className="grid cards" style={{ marginTop: 18 }}>
        {blobs.map((blob, index) => (
          <article className="card" key={index}>
            <span className="badge">Indexed asset</span>
            <p className="code">{JSON.stringify(blob, null, 2)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
