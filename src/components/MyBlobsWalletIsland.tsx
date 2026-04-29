import '../lib/browser-polyfills';
import WalletProvider from './WalletProvider';
import WalletConnect from './WalletConnect';
import MyBlobsIsland from './MyBlobs';

export default function MyBlobsWalletIsland() {
  return (
    <WalletProvider>
      <div className="grid" style={{ marginTop: 28, gap: 22 }}>
        <WalletConnect />
        <MyBlobsIsland />
      </div>
    </WalletProvider>
  );
}
