import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import type { ReactNode } from 'react';

export default function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <AptosWalletAdapterProvider autoConnect onError={(error) => console.error('wallet error', error)}>
      {children}
    </AptosWalletAdapterProvider>
  );
}
