import { AccountAddress } from '@aptos-labs/ts-sdk';
import { SHELBYUSD_FA_METADATA_ADDRESS, ShelbyMicropaymentChannelClient } from '@shelby-protocol/sdk/browser';

export const SHELBYUSD_BASE_UNITS = 100_000_000;
export const MIN_PURCHASABLE_SHELBYUSD = 0.000001;
export const MIN_PURCHASABLE_BASE_UNITS = 100;

export type MonetizationMode = 'public' | 'purchasable';

export function priceShelbyUsdToBaseUnits(input: string | number): number {
  const raw = typeof input === 'number' ? String(input) : input.trim();
  if (!raw) return 0;
  if (!/^\d+(\.\d+)?$/.test(raw)) throw new Error('Invalid ShelbyUSD price');

  const [wholePart, fractionPart = ''] = raw.split('.');
  const whole = BigInt(wholePart || '0');
  const fractionPadded = `${fractionPart}00000000`.slice(0, 8);
  const hasTooManyDecimals = fractionPart.length > 8 && /[1-9]/.test(fractionPart.slice(8));
  if (hasTooManyDecimals) throw new Error('Invalid ShelbyUSD price: max 8 decimals');

  const units = whole * BigInt(SHELBYUSD_BASE_UNITS) + BigInt(fractionPadded || '0');
  if (units > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('Invalid ShelbyUSD price: too large');
  const value = Number(units);
  if (value > 0 && value < MIN_PURCHASABLE_BASE_UNITS) {
    throw new Error(`Purchasable minimum is ${MIN_PURCHASABLE_SHELBYUSD} ShelbyUSD`);
  }
  return value;
}

export function baseUnitsToShelbyUsd(units: number): string {
  const whole = Math.floor(units / SHELBYUSD_BASE_UNITS);
  const fraction = String(units % SHELBYUSD_BASE_UNITS).padStart(8, '0').replace(/0+$/, '');
  return fraction ? `${whole}.${fraction}` : String(whole);
}

export function normalizeMonetizationMode(priceBaseUnits: number): MonetizationMode {
  return priceBaseUnits > 0 ? 'purchasable' : 'public';
}

export function makeCreateShelbyUsdChannelPayload(params: {
  receiver: string;
  depositShelbyUsd: string | number;
  publicKey: Uint8Array;
  expirationDays?: number;
}) {
  const depositAmount = priceShelbyUsdToBaseUnits(params.depositShelbyUsd);
  if (depositAmount <= 0) throw new Error('Channel deposit must be greater than 0');
  const expirationDays = params.expirationDays ?? 7;
  const expirationMicros = Date.now() * 1000 + expirationDays * 24 * 60 * 60 * 1_000_000;

  return ShelbyMicropaymentChannelClient.makeCreateMicropaymentChannelPayload({
    receiver: AccountAddress.fromString(params.receiver),
    expirationMicros,
    depositAmount,
    fungibleAssetAddress: AccountAddress.fromString(SHELBYUSD_FA_METADATA_ADDRESS),
    publicKey: params.publicKey,
  });
}
