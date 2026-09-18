import React, { useState, useEffect, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Star,
  Scissors,
  Home,
  GraduationCap,
  Sparkles,
  Layers,
  Locate,
  CheckCircle,
  Crosshair,
} from 'lucide-react';

export interface MapPetPlace {
  id: string;
  title: string;
  uri: string;
  category: 'vet' | 'spa' | 'kennel' | 'trainer' | 'general' | string;
  lat: number;
  lng: number;
  address?: string;
  rating?: number;
  reviewsCount?: number;
  reviewSnippets?: Array<{ uri?: string; text?: string }>;
}

interface PetGoogleMapSectionProps {
  places: MapPetPlace[];
  center: { lat: number; lng: number };
  userLocationName: string;
  userCoords?: { lat: number; lng: number } | null;
  selectedPlaceId?: string | null;
  onSelectPlace?: (place: MapPetPlace | null) => void;
}

// Controller to smoothly pan and zoom the map when center or selectedPlace changes
function MapCameraController({
  center,
  selectedPlace,
}: {
  center: { lat: number; lng: number };
  selectedPlace?: MapPetPlace | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (selectedPlace) {
      map.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng });
      map.setZoom(15);
    } else if (center) {
      map.panTo({ lat: center.lat, lng: center.lng });
    }
  }, [map, center, selectedPlace]);

  return null;
}

export const PetGoogleMapSection: React.FC<PetGoogleMapSectionProps> = ({
  places,
  center,
  userLocationName,
  userCoords,
  selectedPlaceId,
  onSelectPlace,
}) => {
  const [apiKey, setApiKey] = useState<string>(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  );
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [activePlace, setActivePlace] = useState<MapPetPlace | null>(null);

  // Sync selectedPlaceId prop
  useEffect(() => {
    if (selectedPlaceId) {
      const found = places.find((p) => p.id === selectedPlaceId);
      if (found) setActivePlace(found);
    }
  }, [selectedPlaceId, places]);

  // Fetch API key if not bundled in import.meta.env
  useEffect(() => {
    if (!apiKey) {
      fetch('/api/config/maps-key')
        .then((res) => res.json())
        .then((data) => {
          if (data.apiKey) {
            setApiKey(data.apiKey);
          }
        })
        .catch((err) => {
          console.warn('Could not load Maps API key from backend config:', err);
        });
    }
  }, [apiKey]);

  // Filter places based on active category
  const filteredPlaces = places.filter((place) => {
    if (activeCategoryFilter === 'all') return true;
    return place.category === activeCategoryFilter;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'vet':
        return {
          label: 'Clinic / Hospital',
          color: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: '🏥',
        };
      case 'spa':
        return {
          label: 'Pet Spa & Grooming',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: '✂️',
        };
      case 'kennel':
        return {
          label: 'Kennel & Boarding',
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: '🏨',
        };
      case 'trainer':
        return {
          label: 'Training Academy',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: '🎓',
        };
      default:
        return {
          label: 'Pet Service',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: '🐾',
        };
    }
  };

  const handleMarkerClick = useCallback(
    (place: MapPetPlace) => {
      setActivePlace(place);
      if (onSelectPlace) {
        onSelectPlace(place);
      }
    },
    [onSelectPlace]
  );

  return (
    <div
      id="pet-google-maps-radar-section"
      className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-3 p-4 sm:p-5"
    >
      {/* Header with Title & Filter Chips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-sm shadow-red-500/30">
            <MapPin className="w-5 h-5 fill-white text-red-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-stone-900">
                Live Google Maps Radar & Proximity Tracing
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                Live Markers
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Showing {filteredPlaces.length} nearest pet spas, emergency clinics & kennels around{' '}
              <strong className="text-stone-800">{userLocationName}</strong>
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1 whitespace-nowrap ${
              activeCategoryFilter === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>All Traced ({places.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryFilter('vet')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1 whitespace-nowrap ${
              activeCategoryFilter === 'vet'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-100'
            }`}
          >
            <span>🏥 Clinics & Vets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryFilter('spa')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1 whitespace-nowrap ${
              activeCategoryFilter === 'spa'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100'
            }`}
          >
            <span>✂️ Spas & Groomers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryFilter('kennel')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1 whitespace-nowrap ${
              activeCategoryFilter === 'kennel'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100'
            }`}
          >
            <span>🏨 Kennels & Daycare</span>
          </button>
        </div>
      </div>

      {/* The Google Map Container */}
      <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-inner">
        {apiKey ? (
          <APIProvider apiKey={apiKey} solutionChannel="GMP_AIS">
            <Map
              defaultCenter={center}
              defaultZoom={13}
              mapId="DEMO_MAP_ID"
              gestureHandling="greedy"
              disableDefaultUI={false}
              fullscreenControl={true}
              zoomControl={true}
              mapTypeControl={false}
              streetViewControl={false}
              className="w-full h-full"
            >
              <MapCameraController center={center} selectedPlace={activePlace} />

              {/* User Current Location Marker (Blue Pulse) */}
              {userCoords && (
                <AdvancedMarker
                  position={{ lat: userCoords.lat, lng: userCoords.lng }}
                  title="Your Current Location"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-75" />
                    <div className="relative w-7 h-7 bg-blue-600 text-white rounded-full border-2 border-white shadow-md flex items-center justify-center">
                      <Locate className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </AdvancedMarker>
              )}

              {/* Traced Pet Places with Red Google Map Arrow / Pin Symbols */}
              {filteredPlaces.map((place, idx) => {
                const isSelected = activePlace?.id === place.id;
                const badge = getCategoryBadge(place.category);

                return (
                  <AdvancedMarker
                    key={place.id || `marker-${idx}`}
                    position={{ lat: place.lat, lng: place.lng }}
                    title={place.title}
                    onClick={() => handleMarkerClick(place)}
                  >
                    {/* Authentic Red Google Map Pin Marker with Arrow Tip & Badge Glyph */}
                    <div
                      className={`group relative cursor-pointer transition-transform duration-200 flex flex-col items-center ${
                        isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-20'
                      }`}
                    >
                      {/* Floating Mini Label on Hover or Selection */}
                      {isSelected && (
                        <div className="absolute -top-7 whitespace-nowrap bg-stone-950 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg border border-stone-800">
                          {place.title.length > 22 ? place.title.slice(0, 20) + '...' : place.title}
                        </div>
                      )}

                      {/* Red Pin Teardrop Head */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-colors ${
                          isSelected
                            ? 'bg-rose-700 ring-4 ring-rose-300'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        <span className="text-xs leading-none select-none">
                          {badge.icon}
                        </span>
                      </div>

                      {/* Red Arrow Pointer / Tail pointing to the exact location */}
                      <div className="w-0 h-0 border-x-4 border-x-transparent border-t-[8px] border-t-red-600 -mt-0.5 filter drop-shadow-xs" />
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* Active Place InfoWindow Popup */}
              {activePlace && (
                <InfoWindow
                  position={{ lat: activePlace.lat, lng: activePlace.lng }}
                  onCloseClick={() => setActivePlace(null)}
                  pixelOffset={[0, -38]}
                >
                  <div className="p-1 max-w-[280px] sm:max-w-xs space-y-2 text-stone-900 font-sans">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{getCategoryBadge(activePlace.category).icon}</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          getCategoryBadge(activePlace.category).color
                        }`}
                      >
                        {getCategoryBadge(activePlace.category).label}
                      </span>
                    </div>

                    <h4 className="font-black text-sm text-stone-900 leading-tight">
                      {activePlace.title}
                    </h4>

                    {activePlace.address && (
                      <p className="text-xs text-stone-600 leading-snug">
                        📍 {activePlace.address}
                      </p>
                    )}

                    {activePlace.rating && (
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-stone-800">{activePlace.rating}</span>
                        {activePlace.reviewsCount && (
                          <span className="text-stone-500">({activePlace.reviewsCount} Google reviews)</span>
                        )}
                      </div>
                    )}

                    {activePlace.reviewSnippets && activePlace.reviewSnippets.length > 0 && (
                      <div className="text-[11px] text-stone-600 italic bg-stone-50 p-2 rounded-xl border border-stone-200">
                        "{activePlace.reviewSnippets[0].text}"
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-200 flex items-center gap-2">
                      <a
                        href={activePlace.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1"
                      >
                        <span>Open in Maps</span>
                        <ExternalLink className="w-3 h-3 text-amber-300" />
                      </a>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          activePlace.title + ' ' + userLocationName
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold rounded-lg border border-blue-200 flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3 text-blue-600" />
                        <span>Directions</span>
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          /* Graceful Fallback if API key is waiting */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center animate-pulse">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">Loading Interactive Google Map...</h4>
              <p className="text-xs text-stone-500 max-w-sm mt-1">
                Connecting to Google Maps Platform with live location markers for {userLocationName}.
              </p>
            </div>
          </div>
        )}

        {/* Map Legend Overlay in Bottom-Right Corner */}
        <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-xs border border-stone-200 rounded-xl px-2.5 py-1.5 shadow-md flex items-center gap-2 text-[11px] font-semibold text-stone-700">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span>Red Marker: Pet Service</span>
          </div>
          <span className="text-stone-300">|</span>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Blue: Your GPS</span>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel of Traced Location Cards for Quick Map Panning */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
            Click any location to center map & open directions:
          </span>
          <span className="text-xs font-semibold text-amber-700">
            {filteredPlaces.length} locations mapped
          </span>
        </div>

        <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {filteredPlaces.map((place) => {
            const isSelected = activePlace?.id === place.id;
            const badge = getCategoryBadge(place.category);

            return (
              <div
                key={place.id}
                onClick={() => handleMarkerClick(place)}
                className={`w-64 sm:w-72 shrink-0 p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/30 shadow-sm'
                    : 'bg-stone-50/70 hover:bg-stone-100 border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${badge.color}`}
                    >
                      {badge.icon} {badge.label}
                    </span>
                    {place.rating && (
                      <span className="text-[11px] font-bold text-amber-800 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {place.rating}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-stone-900 line-clamp-1 hover:text-amber-800">
                    {place.title}
                  </h4>
                  {place.address && (
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      📍 {place.address}
                    </p>
                  )}
                </div>

                <div className="pt-1 border-t border-stone-200/60 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 fill-red-600" />
                    <span>Focus on Map</span>
                  </span>
                  <a
                    href={place.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] font-bold text-stone-700 hover:text-stone-900 flex items-center gap-0.5 hover:underline"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
