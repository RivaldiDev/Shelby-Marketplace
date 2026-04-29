import '../lib/browser-polyfills';
import WalletProvider from './WalletProvider';
import WalletConnect from './WalletConnect';
import UploadWizard from './UploadWizard';

export default function UploadWalletIsland() {
  return (
    <WalletProvider>
      <div className="grid" style={{ marginTop: 28, gap: 22 }}>
        <WalletConnect />
        <UploadWizard />
      </div>
    </WalletProvider>
  );
}
