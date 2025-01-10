import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Cpu, Leaf, Shield } from 'lucide-react';
import { PriceChart } from './PriceChart';
import { PurchaseModal } from './PurchaseModal';

interface HashPowerListing {
  id: string;
  algorithm: string;
  name: string;
  description: string;
  available: boolean;
  hash_power: number;
  price_per_th: number;
  min_purchase: number;
  max_purchase: number;
  priceChange: number;
  aiEfficiency: number;
  greenScore: number;
  verified: boolean;
}

interface HashPowerCardProps {
  listing: HashPowerListing;
}

export function HashPowerCard({ listing }: HashPowerCardProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  return (
    <>
      <div className="bg-gray-900/50 rounded-xl p-4 hover:bg-gray-900/70 transition-colors">
        {/* Existing card content */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowPurchaseModal(true)}
            className="flex-1 bg-primary text-background font-medium py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Buy Now
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Schedule</span>
          </button>
        </div>
      </div>

      {showPurchaseModal && (
        <PurchaseModal
          listing={listing}
          onClose={() => setShowPurchaseModal(false)}
          onSuccess={() => {
            setShowPurchaseModal(false);
            // Refresh listings if needed
          }}
        />
      )}
    </>
  );
}