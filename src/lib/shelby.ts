import './browser-polyfills';
import { AccountAddress } from '@aptos-labs/ts-sdk';
import {
  createDefaultErasureCodingProvider,
  generateCommitments,
  ShelbyBlobClient,
  ShelbyRPCClient,
  getShelbyIndexerClient,
} from '@shelby-protocol/sdk/browser';
import { priceShelbyUsdToBaseUnits } from './monetization';
import { aptosNetwork, publicShelbyApiKey, shelbyRpcUrl } from './config';

export type UploadProgress = {
  label: string;
  percent: number;
  detail?: string;
};

export type ManualUploadInput = {
  account: string;
  file: File;
  signAndSubmitTransaction: (transaction: any) => Promise<{ hash?: string }>;
  waitForTransaction?: (hash: string) => Promise<void>;
  priceShelbyUsd?: string | number;
  onProgress?: (progress: UploadProgress) => void;
};

export function getShelbyBlobClient() {
  return new ShelbyBlobClient({
    network: aptosNetwork,
    apiKey: publicShelbyApiKey,
    rpc: { baseUrl: shelbyRpcUrl, apiKey: publicShelbyApiKey },
  });
}

export function getShelbyRpcClient() {
  return new ShelbyRPCClient({
    network: aptosNetwork,
    apiKey: publicShelbyApiKey,
    rpc: { baseUrl: shelbyRpcUrl, apiKey: publicShelbyApiKey },
  });
}

export function getIndexerClient() {
  return getShelbyIndexerClient({ network: aptosNetwork, apiKey: publicShelbyApiKey });
}

export async function listAccountBlobs(account: string) {
  const response = await fetch(`/api/blobs?owner=${encodeURIComponent(account)}`);
  const body = await response.json().catch(() => null) as { ok?: boolean; blobs?: unknown[]; error?: string } | null;
  if (!response.ok || !body?.ok) throw new Error(body?.error || `Failed to load blobs (${response.status})`);
  return body.blobs || [];
}

export async function runManualUpload({ account, file, signAndSubmitTransaction, waitForTransaction, priceShelbyUsd = 0, onProgress }: ManualUploadInput) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const priceBaseUnits = priceShelbyUsdToBaseUnits(priceShelbyUsd);

  onProgress?.({ label: 'Generate storage commitments', percent: 18, detail: priceBaseUnits > 0 ? `Listing price: ${priceShelbyUsd} ShelbyUSD` : 'Free listing with owner-managed access' });

  const provider = await createDefaultErasureCodingProvider();
  const commitments = await generateCommitments(provider, bytes);

  onProgress?.({ label: 'Prepare ShelbyUSD funding', percent: 34, detail: 'Preparing account funding before registration' });
  const fundResponse = await fetch('/api/fund', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address: account }),
  });
  if (!fundResponse.ok) throw new Error(await fundResponse.text());

  onProgress?.({ label: 'Sign Shelby registration', percent: 54, detail: 'Confirm the transaction in your wallet' });
  const payload = ShelbyBlobClient.createRegisterBlobPayload({
    account: AccountAddress.fromString(account),
    blobName: file.name,
    blobSize: bytes.length,
    blobMerkleRoot: commitments.blob_merkle_root,
    expirationMicros: Date.now() * 1000 + 30 * 24 * 60 * 60 * 1_000_000,
    numChunksets: commitments.chunkset_commitments.length,
    encoding: 0,
  });
  const response = await signAndSubmitTransaction({ data: payload });
  if (response.hash && waitForTransaction) await waitForTransaction(response.hash);

  onProgress?.({ label: 'Upload asset data', percent: 76, detail: 'Sending file through the secure Shelby RPC proxy' });
  const form = new FormData();
  form.set('owner', account);
  form.set('blobName', file.name);
  form.set('file', file);
  const uploadResponse = await fetch('/api/upload-blob', { method: 'POST', body: form });
  const uploadBody = await uploadResponse.json().catch(() => null) as { ok?: boolean; error?: string } | null;
  if (!uploadResponse.ok || !uploadBody?.ok) throw new Error(uploadBody?.error || `Upload failed (${uploadResponse.status})`);

  onProgress?.({ label: 'Publishing complete', percent: 100, detail: `${account}/${file.name}` });
  return { owner: account, name: file.name, size: bytes.length, transactionHash: response.hash, priceBaseUnits };
}
