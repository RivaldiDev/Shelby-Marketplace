import { AccountAddress, Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { ace_ex } from './ace-local';
import { AccessPolicy, RegistrationInfo, regsToBytes } from './acePolicy';
import { aceAccessControlContract, aceContract, aceKeypairId, aceRpcUrl } from './config';

const textEncoder = new TextEncoder();

export function requireAceConfig() {
  const missing = [
    ['PUBLIC_ACE_CONTRACT', aceContract],
    ['PUBLIC_ACE_KEYPAIR_ID', aceKeypairId],
    ['PUBLIC_ACE_ACCESS_CONTROL_CONTRACT', aceAccessControlContract],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length) {
    throw new Error(`Missing ACE env: ${missing.join(', ')}`);
  }
}

export function getAceAptosClient() {
  return new Aptos(new AptosConfig({ network: Network.TESTNET, fullnode: aceRpcUrl }));
}

export function makeAceFullBlobName(owner: string, blobName: string) {
  return `${AccountAddress.fromString(owner).toStringLong()}/${blobName}`.replace(/0x/g, '@');
}

export async function encryptBlobForAce({ owner, blobName, plaintext }: { owner: string; blobName: string; plaintext: Uint8Array }) {
  requireAceConfig();
  const aptos = getAceAptosClient();
  const chainId = await aptos.getChainId();
  const contractId = ace_ex.ContractID.newAptos({
    chainId,
    moduleAddr: AccountAddress.fromString(aceAccessControlContract),
    moduleName: 'access_control',
    functionName: 'check_permission',
  });

  const fullBlobName = makeAceFullBlobName(owner, blobName);
  const result = await ace_ex.encrypt({
    keypairId: AccountAddress.fromString(aceKeypairId),
    contractId,
    domain: textEncoder.encode(fullBlobName),
    plaintext,
    aceContract,
    rpcUrl: aceRpcUrl,
  });

  return {
    fullBlobName,
    ciphertext: result.unwrapOrThrow('ACE encryption failed').ciphertext,
  };
}

export function createAceRegisterBlobPayload(blobName: string, priceBaseUnits = 0) {
  const initialAccessPolicy = priceBaseUnits > 0 ? AccessPolicy.newPayToDownload(priceBaseUnits) : AccessPolicy.newAllowlist([]);
  const reg = new RegistrationInfo(blobName, initialAccessPolicy);
  return {
    function: `${aceAccessControlContract}::access_control::register_blobs`,
    typeArguments: [],
    functionArguments: [regsToBytes([reg])],
  };
}
