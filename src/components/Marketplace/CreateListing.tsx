import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { marketplace } from '../../lib/api/marketplace';
import { useFormValidation } from '../../hooks/useFormValidation';
import { z } from 'zod';
import { LoadingSpinner } from '../UI/LoadingSpinner';

const listingSchema = z.object({
  algorithm: z.string().min(1, 'Algorithm is required'),
  hashPower: z.number().min(0.1, 'Hash power must be at least 0.1 TH/s'),
  pricePerTh: z.number().min(0.01, 'Price must be at least 0.01'),
  minPurchase: z.number().min(0.1, 'Minimum purchase must be at least 0.1 TH/s'),
  maxPurchase: z.number().min(0.1, 'Maximum purchase must be at least 0.1 TH/s'),
  availabilityDays: z.string().min(1, 'Availability period is required')
});

export function CreateListing({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    algorithm: 'SHA256',
    hashPower: '',
    pricePerTh: '',
    minPurchase: '',
    maxPurchase: '',
    availabilityDays: '7'
  });

  const { errors, validate, setErrors } = useFormValidation(listingSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const numericData = {
      ...formData,
      hashPower: parseFloat(formData.hashPower),
      pricePerTh: parseFloat(formData.pricePerTh),
      minPurchase: parseFloat(formData.minPurchase),
      maxPurchase: parseFloat(formData.maxPurchase),
    };

    if (!validate(numericData)) {
      return;
    }

    setLoading(true);

    try {
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(now.getDate() + parseInt(formData.availabilityDays));

      await marketplace.createListing({
        seller_id: user!.id,
        algorithm: formData.algorithm,
        hash_power: numericData.hashPower,
        price_per_th: numericData.pricePerTh,
        min_purchase: numericData.minPurchase,
        max_purchase: numericData.maxPurchase,
        availability_window: `[${now.toISOString()},${endDate.toISOString()}]`,
        status: 'active'
      });

      onSuccess();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to create listing' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-6">Create New Listing</h2>

      {errors.submit && (
        <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields remain the same */}
        
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-background px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                Creating...
              </>
            ) : (
              'Create Listing'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}