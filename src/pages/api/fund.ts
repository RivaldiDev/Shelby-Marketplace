import type { APIRoute } from 'astro';
import { Network } from '@aptos-labs/ts-sdk';
import { ShelbyClient } from '@shelby-protocol/sdk/node';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  try {
    const { address } = await request.json();
    if (!address || typeof address !== 'string') {
      return json({ ok: false, error: 'Missing address' }, 400);
    }
    const apiKey = import.meta.env.SHELBY_API_KEY || import.meta.env.GEOMI_API_KEY;
    const geomiApiKey = import.meta.env.GEOMI_API_KEY;
    if (!apiKey) {
      return json({ ok: false, error: 'SHELBY_API_KEY not configured' }, 500);
    }
    const client = new ShelbyClient({
      network: Network.TESTNET,
      apiKey,
      aptos: geomiApiKey ? { network: Network.TESTNET, clientConfig: { API_KEY: geomiApiKey } } : { network: Network.TESTNET },
      faucet: { authToken: apiKey },
    });
    const hash = await client.fundAccountWithShelbyUSD({ address, amount: 100_000_000 });
    return json({ ok: true, hash });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json({ ok: false, error: message }, 500);
  }
};
