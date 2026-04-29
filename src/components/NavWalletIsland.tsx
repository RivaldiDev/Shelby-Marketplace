import '../lib/browser-polyfills';
import WalletProvider from './WalletProvider';
import WalletStatus from './WalletStatus';

export default function NavWalletIsland() {
  return (
    <WalletProvider>
      <WalletStatus compact />
    </WalletProvider>
  );
}
