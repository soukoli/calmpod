"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass } from "@phosphor-icons/react";

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  hint?: string;
}

interface GeoResult {
  place_name: string;
  center: [number, number]; // [lng, lat]
}

export function LocationPicker({ onLocationSelect, hint }: LocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletRef = useRef<any>(null);
  const onLocationSelectRef = useRef(onLocationSelect);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState("");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeoResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  onLocationSelectRef.current = onLocationSelect;

  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || "";

  // Place pin helper — reusable for both click and search
  const placePin = useCallback(
    async (lat: number, lng: number, address?: string) => {
      const L = leafletRef.current;
      const map = mapRef.current;
      if (!L || !map) return;

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Custom violet marker
      const icon = L.divIcon({
        className: "calmpod-marker",
        html: `<div style="width:24px;height:24px;background:rgb(139,92,246);border:3px solid white;border-radius:50%;box-shadow:0 0 20px rgba(139,92,246,0.5),0 4px 12px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);
      markerRef.current = marker;

      // If address already provided (from search), use it directly
      if (address) {
        setSelectedLocation({ lat, lng, address });
        onLocationSelectRef.current(lat, lng, address);
        return;
      }

      // Otherwise reverse geocode
      setLoading(true);
      let resolvedAddress = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      try {
        const res = await fetch(
          `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_KEY}`
        );
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          resolvedAddress = data.features[0].place_name || resolvedAddress;
        }
      } catch {
        // Fallback to coordinates
      }

      setLoading(false);
      setSelectedLocation({ lat, lng, address: resolvedAddress });
      onLocationSelectRef.current(lat, lng, resolvedAddress);
    },
    [MAPTILER_KEY]
  );

  // Forward geocoding search (debounced)
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!value.trim() || value.length < 2) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(value)}.json?key=${MAPTILER_KEY}&country=cz&limit=5&language=cs`
        );
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          setSearchResults(
            data.features.map((f: { place_name: string; center: [number, number] }) => ({
              place_name: f.place_name,
              center: f.center,
            }))
          );
          setSearchOpen(true);
        } else {
          setSearchResults([]);
          setSearchOpen(false);
        }
      } catch {
        setSearchResults([]);
        setSearchOpen(false);
      }
    }, 300);
  };

  // Handle search result selection
  const handleResultSelect = (result: GeoResult) => {
    const [lng, lat] = result.center;
    const map = mapRef.current;

    // Fly to location
    if (map) {
      map.flyTo([lat, lng], 14, { duration: 1.2 });
    }

    // Place pin
    placePin(lat, lng, result.place_name);

    // Close search
    setSearchQuery(result.place_name);
    setSearchResults([]);
    setSearchOpen(false);
  };

  // Map initialization
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    if (!MAPTILER_KEY) {
      setMapError(true);
      return;
    }

    let cancelled = false;

    const initMap = async () => {
      try {
        const L = (await import("leaflet")).default;
        leafletRef.current = L;

        if (cancelled || !mapContainer.current) return;

        const map = L.map(mapContainer.current, {
          center: [49.8, 15.5],
          zoom: 7,
          zoomControl: true,
          attributionControl: false,
          scrollWheelZoom: false,
          touchZoom: true,
          dragging: true,
        });

        // Ctrl+scroll zoom on desktop
        const container = mapContainer.current;
        const handleWheel = (e: WheelEvent) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            map.scrollWheelZoom.enable();
          } else {
            map.scrollWheelZoom.disable();
          }
        };
        container.addEventListener("wheel", handleWheel, { passive: false });

        // MapTiler dark streets tiles
        L.tileLayer(
          `https://api.maptiler.com/maps/streets-v2-dark/{z}/{x}/{y}@2x.png?key=${MAPTILER_KEY}`,
          {
            tileSize: 512,
            zoomOffset: -1,
            maxZoom: 18,
            crossOrigin: true,
          }
        ).addTo(map);

        // Click handler — place/move pin
        map.on("click", (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          placePin(lat, lng);
        });

        mapRef.current = map;

        // Ensure proper sizing after mount
        setTimeout(() => {
          map.invalidateSize();
          if (!cancelled) setMapReady(true);
        }, 100);
      } catch (err) {
        console.error("[LocationPicker] Init error:", err);
        if (!cancelled) setMapError(true);
      }
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [MAPTILER_KEY, placePin]);

  // Manual location submit handler (fallback)
  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;

    const coordMatch = manualInput.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      setSelectedLocation({ lat, lng, address: manualInput });
      onLocationSelectRef.current(lat, lng, manualInput);
    } else {
      setSelectedLocation({ lat: 0, lng: 0, address: manualInput });
      onLocationSelectRef.current(0, 0, manualInput);
    }
  };

  // Error/fallback state
  if (mapError) {
    return (
      <div className="space-y-4">
        <div className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-6">
          {!manualMode ? (
            <div className="text-center space-y-3">
              <p className="text-slate-400 text-sm">
                Mapu se nepodařilo načíst.
              </p>
              <button
                onClick={() => setManualMode(true)}
                className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
              >
                Zadat lokaci ručně →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                Zadej adresu nebo GPS souřadnice (např. 49.1951, 16.6068):
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Adresa nebo souřadnice..."
                  className="flex-1 h-9 px-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none transition-colors text-sm"
                />
                <button
                  onClick={handleManualSubmit}
                  disabled={!manualInput.trim()}
                  className="h-9 px-4 rounded-md bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                >
                  Potvrdit
                </button>
              </div>
              {selectedLocation && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <div className="w-3 h-3 rounded-full bg-violet-400 shrink-0" />
                  <p className="text-sm text-slate-300">{selectedLocation.address}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <div className="relative">
          <MagnifyingGlass
            size={16}
            weight="light"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            placeholder="Hledat adresu..."
            className="w-full h-11 md:h-9 pl-9 pr-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none transition-colors text-sm"
          />
        </div>

        {/* Search results dropdown */}
        <AnimatePresence>
          {searchOpen && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-1 z-50 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden shadow-xl"
            >
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleResultSelect(result)}
                  className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors border-b border-white/5 last:border-b-0"
                >
                  {result.place_name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map container */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden border border-white/10">
        <div ref={mapContainer} className="absolute inset-0 z-0" />

        {/* Loading state */}
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/[0.02] z-10">
            <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Overlay hint */}
        <AnimatePresence>
          {mapReady && !selectedLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none z-10"
            >
              <div className="bg-black/60 backdrop-blur-sm text-white text-xs md:text-sm px-4 py-2 rounded-full border border-white/20">
                {hint || "Klepni na mapu nebo vyhledej adresu"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected location display */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-violet-500/10 border border-violet-500/20"
          >
            <div className="w-3 h-3 rounded-full bg-violet-400 shrink-0" />
            <p className="text-sm text-slate-300">
              {loading ? "Načítám lokaci..." : selectedLocation.address}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LocationPicker;
