import React, { useEffect, useState } from 'react'
import { AnimatedMarqueeHero } from '../components/ui/hero-3'
import ListingItem from '../components/ListingItem'

// A list of sample property image URLs
const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
];

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const query = typeFilter === 'all' ? '?limit=6' : `?type=${typeFilter}&limit=6`;
        const res = await fetch(`/api/listing/get${query}`);
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [typeFilter]);

  return (
    <div>
      {/* Hero Section */}
      <AnimatedMarqueeHero
        tagline="Discover Your Dream Home"
        title={
          <>
            Find the Perfect
            <br />
            Property Today
          </>
        }
        description="Explore a wide range of homes, apartments, and commercial spaces for rent or sale. Connect with owners and landlords to find your perfect property."
        images={PROPERTY_IMAGES}
      />

      {/* Listing Results */}
      <div className="max-w-5xl mx-auto p-3">
        <div className="flex flex-row items-center justify-between max-w-6xl mb-6">
          <h2 className="text-3xl font-semibold text-slate-700 mb-4">Featured Properties</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                typeFilter === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('rent')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                typeFilter === 'rent'
                  ? 'bg-slate-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Rent
            </button>
            <button
              onClick={() => setTypeFilter('sale')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                typeFilter === 'sale'
                  ? 'bg-slate-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sale
            </button>
          </div>
        </div>
        {loading ? (
          <p className="text-center text-xl">Loading properties...</p>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="text-center text-xl">No properties available.</p>
        )}
      </div>
    </div>
  )
}
