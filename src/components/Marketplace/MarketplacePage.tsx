import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { MarketGrid } from './MarketGrid';
import { MarketOverview } from './MarketOverview';
import { TopBar } from './TopBar';
import { AIOptimizationPanel } from './AIOptimizationPanel';
import { CreateListing } from './CreateListing';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { ErrorBoundary } from '../UI/ErrorBoundary';
import { marketplace } from '../../lib/api/marketplace';

export function MarketplacePage() {
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    algorithms: [],
    priceRange: [],
    availability: [],
    search: '',
    sortBy: 'price_asc'
  });

  useEffect(() => {
    loadListings();
  }, [filters]);

  const loadListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: apiError } = await marketplace.getListings({
        algorithm: filters.algorithms.length > 0 ? filters.algorithms[0] : undefined,
        // Add other filters as needed
      });
      if (apiError) throw apiError;
      setListings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="bg-red-500/10 text-red-400 p-6 rounded-lg text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={loadListings}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-[1920px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Hash Power Marketplace</h1>
          <button
            onClick={() => setShowCreateListing(true)}
            className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Listing
          </button>
        </div>

        {showCreateListing ? (
          <ErrorBoundary>
            <CreateListing
              onSuccess={() => {
                setShowCreateListing(false);
                loadListings();
              }}
              onCancel={() => setShowCreateListing(false)}
            />
          </ErrorBoundary>
        ) : (
          <>
            <TopBar 
              filters={filters} 
              onFilterChange={handleFilterChange}
            />
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
              <Sidebar 
                className="w-full lg:w-64 shrink-0" 
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              <div className="flex-grow space-y-6">
                <ErrorBoundary>
                  <AIOptimizationPanel />
                </ErrorBoundary>
                {loading ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : (
                  <ErrorBoundary>
                    <MarketGrid listings={listings} filters={filters} />
                  </ErrorBoundary>
                )}
              </div>
              <ErrorBoundary>
                <MarketOverview className="w-full lg:w-80 shrink-0" />
              </ErrorBoundary>
            </div>
          </>
        )}
      </div>
    </div>
  );
}