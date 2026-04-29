import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { FileUp, LockKeyhole, UploadCloud } from 'lucide-react';
import { runManualUpload, type UploadProgress } from '../lib/shelby';

export default function UploadWizard() {
  const { connected, account, signAndSubmitTransaction } = useWallet();
  const [file, setFile] = useState<File | null>(null);
  const [priceShelbyUsd, setPriceShelbyUsd] = useState('0');
  const [status, setStatus] = useState<UploadProgress>({ label: 'Select a file', percent: 0 });
  const [result, setResult] = useState<{ owner: string; name: string; transactionHash?: string; priceBaseUnits?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const aptos = useMemo(() => new Aptos(new AptosConfig({ network: Network.TESTNET })), []);
  const isPaid = Number(priceShelbyUsd || 0) > 0;

  async function startUpload() {
    if (!file || !account?.address) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const uploaded = await runManualUpload({
        account: account.address.toString(),
        file,
        priceShelbyUsd,
        signAndSubmitTransaction,
        waitForTransaction: async (hash) => {
          await aptos.waitForTransaction({ transactionHash: hash });
        },
        onProgress: setStatus,
      });
      setResult(uploaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus((prev) => ({ ...prev, label: 'Upload failed' }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="upload-studio">
      <div className="upload-panel card glow">
        <div className="upload-panel-head">
          <span className="badge"><UploadCloud size={14}/> Shelby asset publishing</span>
          <h2>Create a marketplace listing</h2>
          <p>Select a file, define optional pricing metadata, then sign the Shelby registration transaction to publish the asset.</p>
        </div>

        <label className="dropzone" htmlFor="blob-file">
          <input id="blob-file" type="file" onChange={(e) => setFile(e.currentTarget.files?.[0] || null)} />
          <span className="dropzone-icon"><FileUp size={24} /></span>
          <strong>{file ? file.name : 'Drop file here or browse from device'}</strong>
          <small>{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB selected` : 'Dataset, document, archive, or encrypted payload supported'}</small>
        </label>

        <div className="upload-options">
          <div className="option-card">
            <span className="field-label">Asset filename</span>
            <input className="input" value={file?.name || ''} placeholder="Selected file name" readOnly />
          </div>
          <div className="option-card accent">
            <span className="field-label">Listing price</span>
            <div className="price-input-row">
              <input
                className="input"
                inputMode="decimal"
                min="0"
                step="0.000001"
                value={priceShelbyUsd}
                onChange={(e) => setPriceShelbyUsd(e.currentTarget.value)}
                placeholder="0.1"
              />
              <span>ShelbyUSD</span>
            </div>
            <p>{isPaid ? 'Stored as marketplace pricing metadata for client review.' : 'Free listing with owner-managed access.'}</p>
          </div>
        </div>

        <button className="btn primary upload-cta" disabled={!connected || !file || busy} onClick={startUpload}>
          <LockKeyhole size={17} /> {busy ? 'Publishing...' : connected ? 'Publish asset' : 'Connect wallet to publish'}
        </button>

        {(busy || status.percent > 0 || error || result) && (
          <div className="upload-status card">
            <div className="progress"><motion.span animate={{ width: `${status.percent}%` }} /></div>
            <p><strong>{status.label}</strong>{status.detail ? ` — ${status.detail}` : ''}</p>
            {error && <div className="warn status-box"><strong>Error</strong><p>{error}</p></div>}
            {result && (
              <div className="status-box">
                <strong>Asset published</strong>
                <p className="code">{result.owner}/{result.name}</p>
                {result.transactionHash && <p className="code">Shelby transaction: {result.transactionHash}</p>}
                {typeof result.priceBaseUnits === 'number' && result.priceBaseUnits > 0 && <p className="code">Listing price: {priceShelbyUsd} ShelbyUSD</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
