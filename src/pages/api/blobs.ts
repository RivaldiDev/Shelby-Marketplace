import type { APIRoute } from 'astro';
import { AccountAddress, Network } from '@aptos-labs/ts-sdk';
import { ShelbyBlobClient } from '@shelby-protocol/sdk/node';
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

export const GET: APIRoute = async ({ url }) => {
  try {
    const owner = url.searchParams.get('owner');
    if (!owner) return json({ ok: false, error: 'Missing owner' }, 400);

    const apiKey = getApiKey();
    if (!apiKey) return json({ ok: false, error: 'Missing SHELBY_API_KEY or GEOMI_API_KEY' }, 500);

    const client = new ShelbyBlobClient({
      network: getNetwork(),
      apiKey,
      indexer: { apiKey },
      aptos: { network: Network.TESTNET, clientConfig: { API_KEY: apiKey } },
    });

    const blobs = await client.getAccountBlobs({ account: AccountAddress.fromString(owner) });
    return json({ ok: true, blobs });
  } catch (err) {
    return json({ ok: false, error: err instanceof Error ? err.message : String(err) }, 500);
  }
};
