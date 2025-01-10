import React, { useState } from 'react';
import { Hero } from './Hero';
import { Features } from './Features';
import { WaitlistSection } from '../Waitlist/WaitlistSection';
import { ConnectWalletModal } from '../Wallet/ConnectWalletModal';

export function HomePage() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  return (
    <>
      <Hero onConnectWallet={() => setIsWalletModalOpen(true)} />
      <WaitlistSection />
      <Features />
      <ConnectWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
}