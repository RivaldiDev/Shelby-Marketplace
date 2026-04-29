import { useEffect, useMemo, useState } from 'react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';
import { SHELBYUSD_FA_METADATA_ADDRESS } from '@shelby-protocol/sdk/browser';

const APT_COIN = '0x1::aptos_coin::AptosCoin';
type AppNetwork = 'shelbynet' | 'testnet';

const networkMap: Record<AppNetwork, Network> = {
  shelbynet: Network.SHELBYNET,
  testnet: Network.TESTNET,
};

function shortAddress(address?: string) {
  if (!address) return '';
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function formatOctas(value: number | null) {
  if (value === null) return '—';
  return (value / 100_000_000).toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function loadNetwork(): AppNetwork {
  if (typeof window === 'undefined') return 'shelbynet';
  const saved = window.localStorage.getItem('shelby-network');
  return saved === 'testnet' ? 'testnet' : 'shelbynet';
}

export default function WalletStatus({ compact = false }: { compact?: boolean }) {
  const { connected, account, disconnect, wallet, network, changeNetwork } = useWallet();
  const [open, setOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<AppNetwork>('shelbynet');
  const [aptBalance, setAptBalance] = useState<number | null>(null);
  const [shelbyUsdBalance, setShelbyUsdBalance] = useState<number | null>(null);
  const [status, setStatus] = useState('Connect a wallet to view balances.');
  const address = account?.address?.toString();
  const aptos = useMemo(() => new Aptos(new AptosConfig({ network: networkMap[selectedNetwork] })), [selectedNetwork]);

  useEffect(() => {
    setSelectedNetwork(loadNetwork());
  }, []);

  async function refreshBalances() {
    if (!address) return;
    setStatus(`Reading ${selectedNetwork} balances...`);
    const [apt, shelby] = await Promise.allSettled([
      aptos.getBalance({ accountAddress: address, asset: APT_COIN }),
      aptos.getBalance({ accountAddress: address, asset: SHELBYUSD_FA_METADATA_ADDRESS }),
    ]);
    setAptBalance(apt.status === 'fulfilled' ? apt.value : null);
    setShelbyUsdBalance(shelby.status === 'fulfilled' ? shelby.value : null);
    setStatus(apt.status === 'fulfilled' || shelby.status === 'fulfilled' ? `${selectedNetwork} balances are up to date.` : `Unable to refresh ${selectedNetwork} balances.`);
  }

  async function handleNetworkChange(value: AppNetwork) {
    setSelectedNetwork(value);
    setAptBalance(null);
    setShelbyUsdBalance(null);
    window.localStorage.setItem('shelby-network', value);
    setStatus(`Using ${value}.`);
    if (connected) {
      try {
        await changeNetwork(networkMap[value] as any);
        setStatus(`Wallet network switched to ${value}.`);
      } catch {
        setStatus(`${wallet?.name ?? 'Wallet'} may not support network switching. Marketplace view updated to ${value}.`);
      }
    }
  }

  useEffect(() => {
    if (connected && address) refreshBalances();
    if (!connected) {
      setAptBalance(null);
      setShelbyUsdBalance(null);
      setOpen(false);
      setStatus('Connect a wallet to view balances.');
    }
  }, [connected, address, selectedNetwork]);

  const networkSelect = (
    <select className="network-select" value={selectedNetwork} onChange={(event) => handleNetworkChange(event.currentTarget.value as AppNetwork)}>
      <option value="shelbynet">Shelbynet</option>
      <option value="testnet">Testnet</option>
    </select>
  );

  if (!connected) {
    return (
      <div className={compact ? 'wallet-mini' : 'wallet-panel'}>
        <WalletSelector />
        {networkSelect}
        {!compact && <p>{status}</p>}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="wallet-profile-wrap">
        <button className="wallet-chip" onClick={() => setOpen((value) => !value)} title={address || ''}>
          <span className="wallet-dot" />
          {shortAddress(address)}
          <span aria-hidden="true">▾</span>
        </button>
        {networkSelect}
        {open && (
          <div className="wallet-dropdown">
            <div className="wallet-dropdown-head">
              <strong>{wallet?.name ?? 'Wallet'}</strong>
              <button className="dropdown-close" onClick={() => setOpen(false)}>×</button>
            </div>
            <p className="code">{address}</p>
            <div className="balance-grid">
              <div className="kpi"><strong>{formatOctas(aptBalance)}</strong><span>APT balance</span></div>
              <div className="kpi"><strong>{formatOctas(shelbyUsdBalance)}</strong><span>ShelbyUSD</span></div>
            </div>
            <p>{status} Wallet network: {network?.name ?? 'Not reported'}.</p>
            <div className="actions">
              <button className="btn" onClick={refreshBalances}>Refresh</button>
              <button className="btn" onClick={disconnect}>Disconnect</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="wallet-panel">
      <div className="wallet-mini connected">
        <button className="wallet-chip" onClick={() => setOpen((value) => !value)} title={address || ''}>
          <span className="wallet-dot" />
          {shortAddress(address)}
        </button>
        {networkSelect}
      </div>
      <div className="balance-grid">
        <div className="kpi"><strong>{formatOctas(aptBalance)}</strong><span>APT balance</span></div>
        <div className="kpi"><strong>{formatOctas(shelbyUsdBalance)}</strong><span>ShelbyUSD</span></div>
      </div>
      <p>{status} Wallet network: {network?.name ?? 'Not reported'}.</p>
      <div className="actions">
        <button className="btn" onClick={refreshBalances}>Refresh</button>
        <button className="btn" onClick={disconnect}>Disconnect {wallet?.name || ''}</button>
      </div>
    </div>
  );
}
