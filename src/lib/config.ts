import { Network } from '@aptos-labs/ts-sdk';
import type { ShelbyNetwork } from '@shelby-protocol/sdk/browser';

export const aptosNetwork = ((import.meta.env.PUBLIC_APTOS_NETWORK || 'shelbynet').toLowerCase() === 'local'
  ? Network.LOCAL
  : (import.meta.env.PUBLIC_APTOS_NETWORK || 'shelbynet').toLowerCase() === 'shelbynet'
    ? Network.SHELBYNET
    : Network.TESTNET) as ShelbyNetwork;

export const publicShelbyApiKey = import.meta.env.PUBLIC_SHELBY_API_KEY || '';
export const shelbyRpcUrl = import.meta.env.PUBLIC_SHELBY_RPC_URL || 'https://api.shelbynet.shelby.xyz/shelby';
export const shelbyExplorerUrl = import.meta.env.PUBLIC_SHELBY_EXPLORER_URL || 'https://explorer.shelby.xyz/shelbynet';
export const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321';

export const aceRpcUrl = import.meta.env.PUBLIC_ACE_RPC_URL || 'https://api.testnet.aptoslabs.com/v1';
export const aceContract = import.meta.env.PUBLIC_ACE_CONTRACT || '';
export const aceKeypairId = import.meta.env.PUBLIC_ACE_KEYPAIR_ID || '';
export const aceAccessControlContract = import.meta.env.PUBLIC_ACE_ACCESS_CONTROL_CONTRACT || '';
