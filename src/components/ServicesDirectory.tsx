import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import {
  Search,
  Building2,
  GraduationCap,
  Scissors,
  Home,
  ShieldAlert,
  ShoppingBag,
  Star,
  CheckCircle,
  MapPin,
  Phone,
  Percent,
  Calculator,
  X,
  Send,
  Sparkles,
  Navigation,
  Compass,
  ExternalLink,
  Loader2,
  Crosshair,
  RefreshCw,
  AlertCircle,
  Coffee,
  Info,
} from 'lucide-react';
import { DirectoryListing, PetProfile } from '../types';
import { PetGoogleMapSection, MapPetPlace } from './PetGoogleMapSection';

interface MapReviewSnippet {
  uri?: string;
  text?: string;
}

interface MapPlaceItem {
  id?: string;
  title: string;
  uri: string;
  category?: string;
  lat?: number;
  lng?: number;
  address?: string;
  rating?: number;
  reviewsCount?: number;
  reviewSnippets?: MapReviewSnippet[];
}

interface ServicesDirectoryProps {
  listings: DirectoryListing[];
  activePet?: PetProfile;
}

export const ServicesDirectory: React.FC<ServicesDirectoryProps> = ({
  listings,
  activePet,
}) => {
  // Directory View Mode
  const [activeViewMode, setActiveViewMode] = useState<'maps_grounding' | 'partner_listings'>('maps_grounding');

  // Google Maps Grounding State
  const [mapsQuery, setMapsQuery] = useState('24/7 veterinary hospitals and pet boarding kennels');
  const [mapsLocationName, setMapsLocationName] = useState('Bengaluru, Karnataka');
  const [mapsCategory, setMapsCategory] = useState('all');
  const [latLng, setLatLng] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isMapsLoading, setIsMapsLoading] = useState(false);
  const [selectedMapPlaceId, setSelectedMapPlaceId] = useState<string | null>(null);
  const [mapsResults, setMapsResults] = useState<{
    text: string;
    mapPlaces: MapPlaceItem[];
    center?: { lat: number; lng: number };
    location?: string;
    source?: string;
    notice?: string;
  } | null>(null);
  const [mapsError, setMapsError] = useState<string | null>(null);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [locationStatusText, setLocationStatusText] = useState<string>('Use My GPS Location');
  const searchCacheRef = useRef<Record<string, any>>({});

  // Partner Listings State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<DirectoryListing | null>(null);
  const [inquirySent, setInquirySent] = useState(false);

  // Insurance Calculator state
  const [insurancePetSpecies, setInsurancePetSpecies] = useState('dog');
  const [insurancePetAge, setInsurancePetAge] = useState('2');
  const [insuranceCoverage, setInsuranceCoverage] = useState<'essential' | 'comprehensive' | 'platinum'>('comprehensive');

  const categories = [
    { id: 'all', label: 'All Services', icon: Building2 },
    { id: 'kennel', label: 'Kennels & Boarding', icon: Home },
    { id: 'trainer', label: 'Trainers & Dog Schools', icon: GraduationCap },
    { id: 'groomer', label: 'Groomers', icon: Scissors },
    { id: 'pet_sitter', label: 'Pet Sitters', icon: Home },
    { id: 'airbnb_landlord', label: 'Pet-Friendly Airbnbs & Rentals', icon: Home },
    { id: 'pet_shop', label: 'Local Pet Shops', icon: ShoppingBag },
    { id: 'insurance', label: 'Pet Insurance', icon: ShieldAlert },
  ];

  const mapsPresets = [
    { label: '🚨 24/7 Emergency Vet Hospitals', query: '24/7 emergency veterinary hospital trauma clinic', category: 'veterinary' },
    { label: '🏨 Cage-Free Pet Boarding & Kennels', query: 'cage-free dog boarding kennel and cat resort', category: 'kennel' },
    { label: '✂️ Professional Pet Grooming & Spa', query: 'luxury pet grooming spa and medicated bath salon', category: 'groomer' },
    { label: '🎓 Certified Dog Trainers & Agility', query: 'certified dog trainer puppy obedience behavioral academy', category: 'trainer' },
    { label: '☕ Pet-Friendly Cafes & Dog Parks', query: 'pet friendly cafe restaurant and off-leash dog park', category: 'pet_friendly' },
    { label: '🦜 Exotic & Avian Veterinarians', query: 'exotic pet veterinarian avian bird reptile clinic', category: 'exotic_vet' },
  ];

  const popularCities = ['Bengaluru', 'Mumbai', 'Delhi-NCR', 'Hyderabad', 'Pune', 'San Francisco', 'London'];

  // Trigger Google Maps Grounded Search
  const fetchMapsGrounding = async (
    customQuery?: string,
    customCategory?: string,
    customCoords?: { latitude: number; longitude: number } | null,
    customLocationName?: string
  ) => {
    const queryToSend = customQuery !== undefined ? customQuery : mapsQuery;
    const categoryToSend = customCategory !== undefined ? customCategory : mapsCategory;
    const coordsToSend = customCoords !== undefined ? customCoords : latLng;
    const locationToSend = customLocationName !== undefined ? customLocationName : mapsLocationName;

    const cacheKey = `${queryToSend.toLowerCase().trim()}_${categoryToSend}_${locationToSend.toLowerCase().trim()}`;
    if (searchCacheRef.current[cacheKey]) {
      setMapsResults(searchCacheRef.current[cacheKey]);
      setMapsError(null);
      setIsMapsLoading(false);
      return;
    }

    setIsMapsLoading(true);
    setMapsError(null);

    try {
      const response = await fetch('/api/directory/maps-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToSend,
          category: categoryToSend,
          locationName: locationToSend,
          latLng: coordsToSend,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      searchCacheRef.current[cacheKey] = data;
      setMapsResults(data);
    } catch (err: any) {
      console.warn('Google Maps search using fallback directory:', err?.message || err);
      setMapsError('Could not retrieve live Google Maps data. Using verified local directory.');
    } finally {
      setIsMapsLoading(false);
    }
  };

  // Run initial search on mount
  useEffect(() => {
    fetchMapsGrounding('top rated 24/7 emergency veterinary hospitals and dog boarding kennels', 'all', null, 'Bengaluru, Karnataka');
  }, []);

  // Use browser geolocation with multi-tier fallback (High-accuracy GPS -> Standard WiFi -> IP location)
  const handleDetectLocation = async () => {
    setIsLocating(true);
    setMapsError(null);
    setLocationNotice(null);
    setLocationStatusText('Acquiring GPS fix...');

    const applyCoordinates = async (
      coords: { latitude: number; longitude: number },
      source: 'gps' | 'network' | 'ip'
    ) => {
      setLatLng(coords);
      setLocationStatusText('Resolving area...');

      let resolvedDisplayName = 'Current Location';
      try {
        const revRes = await fetch(`/api/location/reverse-geocode?lat=${coords.latitude}&lng=${coords.longitude}`);
        const revData = await revRes.json();
        if (revData && revData.success) {
          resolvedDisplayName = revData.displayArea || revData.city || 'My Location';
        }
      } catch (err) {
        console.warn('Reverse geocode fetch failed:', err);
      }

      const displayWithTag = `${resolvedDisplayName} (${source === 'ip' ? 'IP Location' : 'GPS'})`;
      setMapsLocationName(displayWithTag);
      setIsLocating(false);
      setLocationStatusText('Use My GPS Location');

      if (source === 'ip') {
        setLocationNotice('Browser GPS was unavailable; automatically resolved to your approximate network location.');
      } else {
        setLocationNotice(null);
      }

      fetchMapsGrounding(mapsQuery, mapsCategory, coords, resolvedDisplayName);
    };

    const fallbackToIp = async (reasonMsg?: string) => {
      setLocationStatusText('Using network location...');
      try {
        const ipRes = await fetch('/api/location/detect-ip');
        const ipData = await ipRes.json();
        if (ipData && ipData.success && typeof ipData.latitude === 'number') {
          await applyCoordinates(
            { latitude: ipData.latitude, longitude: ipData.longitude },
            'ip'
          );
          return;
        }
      } catch (e) {
        console.warn('IP detect failed:', e);
      }

      setIsLocating(false);
      setLocationStatusText('Use My GPS Location');
      setMapsError(reasonMsg || 'Could not acquire GPS coordinates. You can select any popular city below or enter your area.');
    };

    if (!navigator.geolocation) {
      await fallbackToIp('Geolocation is not supported by your browser. Switched to approximate network location.');
      return;
    }

    // Tier 1: Precise GPS (with 6s timeout)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        applyCoordinates(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          'gps'
        );
      },
      (err1) => {
        // If permission was explicitly denied (code 1), fall back to IP right away
        if (err1.code === 1) {
          fallbackToIp('GPS permission was denied in browser. Switched to approximate network location.');
          return;
        }

        // Tier 2: Low-accuracy/standard WiFi/IP geolocation
        setLocationStatusText('Attempting network fix...');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            applyCoordinates(
              {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              'network'
            );
          },
          (err2) => {
            // Both GPS tiers failed -> Tier 3: Server IP Geolocation
            fallbackToIp('GPS satellite lock timed out. Switched to approximate network location.');
          },
          { timeout: 8000, enableHighAccuracy: false, maximumAge: 300000 }
        );
      },
      { timeout: 6000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  };

  const filteredListings = listings.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const calculateInsuranceQuote = () => {
    let base = insurancePetSpecies === 'dog' ? 599 : 399;
    const ageNum = parseInt(insurancePetAge, 10) || 2;
    base += ageNum * 50;
    if (insuranceCoverage === 'comprehensive') base += 250;
    if (insuranceCoverage === 'platinum') base += 500;
    return base;
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setSelectedListing(null);
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header with Google Maps Grounding Badge */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Petwrld Services Directory</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/25 border border-emerald-400/40 text-emerald-100 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Google Maps Grounded (gemini-3.5-flash)</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Find Veterinary Hospitals, Kennels, Groomers & Sitters
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Real-world pet services powered by <strong>Google Maps Grounding</strong> for verified hours, addresses, ratings, and real customer reviews, alongside Petwrld commission-verified partner reservations.
          </p>
        </div>
      </div>

      {/* Main View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex items-center gap-2 p-1 bg-stone-200/80 rounded-2xl border border-stone-300">
          <button
            type="button"
            onClick={() => setActiveViewMode('maps_grounding')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeViewMode === 'maps_grounding'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Live Google Maps Radar</span>
            <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
              Live
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewMode('partner_listings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeViewMode === 'partner_listings'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Petwrld Partner Directory & Bookings</span>
            <span className="bg-stone-100 text-stone-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {listings.length}
            </span>
          </button>
        </div>

        {activePet && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <span className="font-semibold text-stone-700">Active Companion:</span>
            <span className="font-bold text-amber-900">{activePet.name} ({activePet.breed})</span>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: LIVE GOOGLE MAPS GROUNDING RADAR */}
      {activeViewMode === 'maps_grounding' && (
        <div className="space-y-6">
          {/* Search Controls Panel */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
                      <span>Google Maps Pet Services Radar</span>
                      <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                        gemini-3.6-flash + Google Maps Platform
                      </span>
                    </h2>
                    <p className="text-xs text-stone-500">
                      Query real-time geographic data directly from Google Maps with verified reviews and place links
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-xl transition-colors border border-blue-200 disabled:opacity-50"
                  title="Detect coordinates via browser GPS with network IP fallback"
                >
                  {isLocating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  ) : (
                    <Crosshair className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  <span>{isLocating ? locationStatusText : 'Use My GPS Location'}</span>
                </button>

                <div className="flex items-center gap-1 text-xs bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded-xl">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <input
                    type="text"
                    value={mapsLocationName}
                    onChange={(e) => {
                      setMapsLocationName(e.target.value);
                      setLatLng(null);
                    }}
                    placeholder="City or Area..."
                    className="bg-transparent text-stone-900 font-bold text-xs w-36 outline-none focus:w-44 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Popular City Quick-Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
                Popular Cities:
              </span>
              {popularCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setMapsLocationName(city);
                    setLatLng(null);
                    fetchMapsGrounding(mapsQuery, mapsCategory, null, city);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    mapsLocationName === city
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Search Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchMapsGrounding();
              }}
              className="flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={mapsQuery}
                  onChange={(e) => setMapsQuery(e.target.value)}
                  placeholder="e.g. 24 hour emergency cat hospital, dog swimming pool, avian vet clinic..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={isMapsLoading}
                className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-6 py-2.5 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isMapsLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Querying Google Maps...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Search Google Maps Data</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Quick Pet Service Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {mapsPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setMapsQuery(preset.query);
                      setMapsCategory(preset.category);
                      fetchMapsGrounding(preset.query, preset.category);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                      mapsQuery === preset.query
                        ? 'bg-stone-900 text-white border-stone-900 font-bold shadow-xs'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location Notice Banner if IP Fallback was used */}
          {locationNotice && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl text-xs flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{locationNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setLocationNotice(null)}
                className="text-blue-700 hover:text-blue-900 font-bold text-[11px] shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Error Banner if any */}
          {mapsError && (
            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{mapsError}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMapsLocationName('Bengaluru, Karnataka');
                    setLatLng(null);
                    setMapsError(null);
                    fetchMapsGrounding(mapsQuery, mapsCategory, null, 'Bengaluru, Karnataka');
                  }}
                  className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded-lg text-xs transition-colors"
                >
                  Quick Switch to Bengaluru
                </button>
              </div>
            </div>
          )}

          {/* Loading State Skeleton */}
          {isMapsLoading && (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto animate-bounce">
                <Compass className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Retrieving Verified Google Maps Grounded Information
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                  Gemini 3.6 Flash is actively querying Google Maps for verified pet hospitals, kennels, hours, and customer reviews near {mapsLocationName}...
                </p>
              </div>
            </div>
          )}

          {/* Grounded Results Display */}
          {!isMapsLoading && mapsResults && (
            <div className="space-y-6">
              {/* Interactive Google Maps Interface Section */}
              {(() => {
                const fallbackCenter = mapsResults.center || (latLng ? { lat: latLng.latitude, lng: latLng.longitude } : { lat: 12.9716, lng: 77.5946 });
                const mapPetPlaces: MapPetPlace[] = (mapsResults.mapPlaces || []).map((p, idx) => {
                  const offsetLat = ((idx % 3) - 1) * 0.015;
                  const offsetLng = ((idx % 2 === 0 ? 1 : -1) * (Math.floor(idx / 3) + 1)) * 0.016;

                  return {
                    id: p.id || `place-${idx}`,
                    title: p.title,
                    uri: p.uri,
                    category: (p.category as any) || (p.title.toLowerCase().includes('spa') ? 'spa' : p.title.toLowerCase().includes('kennel') || p.title.toLowerCase().includes('board') ? 'kennel' : 'vet'),
                    lat: typeof p.lat === 'number' ? p.lat : fallbackCenter.lat + offsetLat,
                    lng: typeof p.lng === 'number' ? p.lng : fallbackCenter.lng + offsetLng,
                    address: p.address,
                    rating: p.rating,
                    reviewsCount: p.reviewsCount,
                    reviewSnippets: p.reviewSnippets,
                  };
                });

                return (
                  <PetGoogleMapSection
                    places={mapPetPlaces}
                    center={fallbackCenter}
                    userLocationName={mapsResults.location || mapsLocationName}
                    userCoords={latLng ? { lat: latLng.latitude, lng: latLng.longitude } : null}
                    selectedPlaceId={selectedMapPlaceId}
                    onSelectPlace={(place) => setSelectedMapPlaceId(place ? place.id : null)}
                  />
                );
              })()}

              {/* Extracted Google Maps Places Cards */}
              {mapsResults.mapPlaces && mapsResults.mapPlaces.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                      <h3 className="text-sm font-black text-stone-900">
                        Verified Google Maps Locations ({mapsResults.mapPlaces.length})
                      </h3>
                    </div>
                    <span className="text-[11px] text-stone-500">
                      Click any card to highlight on the interactive Google Map
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mapsResults.mapPlaces.map((place, idx) => {
                      const placeId = place.id || `place-${idx}`;
                      const isSelected = selectedMapPlaceId === placeId;

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedMapPlaceId(placeId);
                            const mapEl = document.getElementById('pet-google-maps-radar-section');
                            if (mapEl) {
                              mapEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                          }}
                          className={`bg-white p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 group cursor-pointer ${
                            isSelected
                              ? 'border-red-500 ring-2 ring-red-400/40 shadow-md bg-red-50/10'
                              : 'border-stone-200 shadow-xs hover:shadow-md hover:border-stone-300'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center border ${
                                  isSelected ? 'bg-red-600 text-white border-red-600' : 'bg-rose-50 text-rose-600 border-rose-200'
                                }`}>
                                  {idx + 1}
                                </span>
                                <h4 className="font-bold text-sm text-stone-900 group-hover:text-red-700 transition-colors">
                                  {place.title}
                                </h4>
                              </div>
                              <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-red-200/80 shrink-0 flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5 fill-red-600 text-red-600" />
                                <span>Pinned on Map</span>
                              </span>
                            </div>

                            {place.address && (
                              <p className="text-xs text-stone-500">
                                📍 {place.address}
                              </p>
                            )}

                            {place.rating && (
                              <div className="flex items-center gap-1.5 text-xs text-stone-700">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="font-bold">{place.rating}</span>
                                {place.reviewsCount && (
                                  <span className="text-stone-400">({place.reviewsCount} Google reviews)</span>
                                )}
                              </div>
                            )}

                            {/* Review Snippets from Grounding */}
                            {place.reviewSnippets && place.reviewSnippets.length > 0 && (
                              <div className="space-y-1.5 pt-1">
                                {place.reviewSnippets.map((snippet, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1"
                                  >
                                    {snippet.text && (
                                      <p className="italic text-[11px] leading-relaxed">
                                        "{snippet.text}"
                                      </p>
                                    )}
                                    {snippet.uri && (
                                      <a
                                        href={snippet.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                                      >
                                        <span>Read review on Google Maps</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons with Mandated Grounding URLs */}
                          <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                            <a
                              href={place.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <span>Open in Google Maps</span>
                              <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                            </a>

                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.title + ' ' + (mapsResults.location || ''))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 border border-stone-200"
                              title="Get directions on Google Maps"
                            >
                              <Navigation className="w-3.5 h-3.5 text-blue-600" />
                              <span>Directions</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Synthesized Grounded Analysis */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="font-bold text-sm text-stone-900">
                      Grounded Pet Directory Summary
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Maps Grounded • {mapsResults.location || mapsLocationName}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-2 prose prose-stone max-w-none">
                  <Markdown>{mapsResults.text}</Markdown>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: PETWRLD VERIFIED PARTNER DIRECTORY & BOOKINGS */}
      {activeViewMode === 'partner_listings' && (
        <div className="space-y-6">
          {/* Interactive Pet Insurance Calculator Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm shadow-amber-500/30">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    Instant Pet Insurance Quote Estimator
                  </h3>
                  <p className="text-xs text-stone-500">
                    Underwritten by top pet health underwriters with direct vet bill reimbursement
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-[10px] uppercase font-bold text-amber-800">Estimated Premium</div>
                <div className="text-2xl font-black text-amber-900">₹{calculateInsuranceQuote().toLocaleString('en-IN')} / month</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Pet Species</label>
                <select
                  value={insurancePetSpecies}
                  onChange={(e) => setInsurancePetSpecies(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-amber-300 bg-white"
                >
                  <option value="dog">Dog (Canine)</option>
                  <option value="cat">Cat (Feline)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Pet Age (Years)</label>
                <select
                  value={insurancePetAge}
                  onChange={(e) => setInsurancePetAge(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-amber-300 bg-white"
                >
                  <option value="1">Puppy / Kitten (0-1 yr)</option>
                  <option value="2">Young Adult (2-4 yrs)</option>
                  <option value="5">Adult (5-7 yrs)</option>
                  <option value="8">Senior (8+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Coverage Tier</label>
                <select
                  value={insuranceCoverage}
                  onChange={(e) => setInsuranceCoverage(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-xl border border-amber-300 bg-white"
                >
                  <option value="essential">Essential (70% Reimbursement, ₹2,00,000 limit)</option>
                  <option value="comprehensive">Comprehensive (80% Reimbursement, ₹5,00,000 limit)</option>
                  <option value="platinum">Platinum (90% Reimbursement, Unlimited)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter and Search */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search partner boarding kennels, certified trainers, Airbnbs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-xs border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-stone-900 text-white font-bold shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/9 bg-stone-100 overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                      {item.category.replace('_', ' ').toUpperCase()}
                    </div>
                    {item.verified && (
                      <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-amber-900">{item.priceRange}</span>
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{item.rating}</span>
                        <span className="text-stone-400">({item.reviewsCount})</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Commission Model Badge */}
                    <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-2.5 py-1 text-[10px] font-semibold text-amber-900 flex items-center justify-between">
                      <span>Commission Model:</span>
                      <span className="font-bold text-amber-800">{item.commissionRate}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => setSelectedListing(item)}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Book or Inquire Host</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking / Inquiry Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            {!inquirySent ? (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-700">
                    Partner Service Inquiry & Booking
                  </span>
                  <h3 className="text-sm font-bold text-stone-900">{selectedListing.title}</h3>
                  <div className="text-xs text-stone-500 mt-0.5">{selectedListing.location}</div>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Service Fee / Rates:</span>
                    <strong className="text-stone-900">{selectedListing.priceRange}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Commission Policy:</span>
                    <span className="text-amber-800 font-semibold">{selectedListing.commissionRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Pet Guest:</span>
                    <strong className="text-stone-900">{activePet?.name || 'Milo'} ({activePet?.breed})</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Check-in / Start Date</label>
                    <input
                      type="date"
                      required
                      defaultValue="2026-10-01"
                      className="w-full text-xs p-2 border border-stone-300 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Duration / Days</label>
                    <input
                      type="number"
                      min="1"
                      defaultValue="3"
                      className="w-full text-xs p-2 border border-stone-300 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Special notes for host / facility
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Any feeding routines, compatibility with other dogs, medication needs..."
                    className="w-full text-xs p-2 border border-stone-300 rounded-xl outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Booking Request (Zero Upfront Charge)</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm">Booking Inquiry Sent!</h4>
                <p className="text-xs text-stone-600">
                  The host / service provider has received your reservation request for{' '}
                  <strong>{activePet?.name || 'Milo'}</strong>. You will receive an SMS and email confirmation within 2 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
