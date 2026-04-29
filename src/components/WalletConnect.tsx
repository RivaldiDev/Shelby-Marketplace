import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';

export default function WalletConnect() {
  const { connected, account, disconnect } = useWallet();
  const address = account?.address?.toString();

  if (connected) {
    return (
      <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <span className="badge">Connected wallet</span>
          <p className="code" style={{ margin: '10px 0 0' }}>{address}</p>
        </div>
        <button className="btn" onClick={disconnect}>Disconnect</button>
      </div>
    );
  }

  return (
    <div className="card glow">
      <span className="badge">Supported Aptos wallets</span>
      <h3>Connect a wallet</h3>
      <p>Connect a supported Aptos wallet to publish assets, view balances, and manage access.</p>
      <div className="actions">
        <WalletSelector />
      </div>
    </div>
  );
}
