import type { APIRoute } from 'astro';
import { AccountAddress, Network } from '@aptos-labs/ts-sdk';
import { ShelbyRPCClient } from '@shelby-protocol/sdk/node';
import type { ShelbyNetwork } from '@shelby-protocol/sdk/node';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const getNetwork = () => {
  const value = (import.meta.env.PUBLIC_APTOS_NETWORK || 'shelbynet').toLowerCase();
  if (value === 'local') return Network.LOCAL as ShelbyNetwork;
  if (value === 'shelbynet') return Network.SHELBYNET as ShelbyNetwork;
  return Network.TESTNET as ShelbyNetwork;
};

const getApiKey = () => import.meta.env.SHELBY_API_KEY || import.meta.env.GEOMI_API_KEY || '';

export const POST: APIRoute = async ({ request }) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return json({ ok: false, error: 'Missing SHELBY_API_KEY or GEOMI_API_KEY' }, 500);

    const form = await request.formData();
    const owner = String(form.get('owner') || '');
    const blobName = String(form.get('blobName') || '');
    const file = form.get('file');

    if (!owner || !blobName || !(file instanceof File)) {
      return json({ ok: false, error: 'Missing owner, blobName, or file' }, 400);
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const client = new ShelbyRPCClient({
      network: getNetwork(),
      apiKey,
      rpc: { apiKey, baseUrl: import.meta.env.PUBLIC_SHELBY_RPC_URL || undefined },
      indexer: { apiKey },
    });

    await client.putBlob({
      account: AccountAddress.fromString(owner),
      blobName,
      blobData: bytes,
    });

    return json({ ok: true, owner, blobName, size: bytes.length });
  } catch (err) {
    return json({ ok: false, error: err instanceof Error ? err.message : String(err) }, 500);
  }
};
