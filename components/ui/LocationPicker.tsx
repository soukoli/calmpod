"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  hint?: string;
}

export function LocationPicker({ onLocationSelect, hint }: LocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);
  const onLocationSelectRef = useRef(onLocationSelect);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  onLocationSelectRef.current = onLocationSelect;

  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || "";

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    if (!MAPTILER_KEY) {
      setMapError(true);
      return;
    }

    let cancelled = false;

    const initMap = async () => {
      try {
        // Dynamic import — only runs in browser
        const maplibregl = (await import("maplibre-gl")).default;

        if (cancelled || !mapContainer.current) return;

        const map = new maplibregl.Map({
          container: mapContainer.current,
          style: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`,
          center: [15.5, 49.8],
          zoom: 7,
          attributionControl: false,
        });

        mapRef.current = map;

        map.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          "top-right"
        );

        map.on("load", () => {
          if (!cancelled) setMapReady(true);
        });

        map.on("click", async (e: { lngLat: { lng: number; lat: number } }) => {
          const { lng, lat } = e.lngLat;

          // Remove existing marker
          if (markerRef.current) {
            (markerRef.current as { remove: () => void }).remove();
          }

          // Create pin element
          const el = document.createElement("div");
          el.style.cssText = `
            width: 24px; height: 24px;
            background: rgb(139, 92, 246);
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.5), 0 4px 12px rgba(0,0,0,0.3);
            animation: pin-pulse 2s ease-in-out infinite;
          `;

          const newMarker = new maplibregl.Marker({ element: el })
            .setLngLat([lng, lat])
            .addTo(map);
          markerRef.current = newMarker;

          // Reverse geocoding
          setLoading(true);
          let address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

          try {
            const res = await fetch(
              `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_KEY}`
            );
            const data = await res.json();
            if (data.features && data.features.length > 0) {
              address = data.features[0].place_name || address;
            }
          } catch {
            // Fallback to coordinates
          }

          setLoading(false);
          setSelectedLocation({ lat, lng, address });
          onLocationSelectRef.current(lat, lng, address);
        });

        map.on("error", () => {
          if (!cancelled) setMapError(true);
        });
      } catch (err) {
        console.error("Map init error:", err);
        if (!cancelled) setMapError(true);
      }
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
      }
    };
  }, [MAPTILER_KEY]);

  if (mapError) {
    return (
      <div className="w-full h-[350px] md:h-[400px] lg:h-[500px] rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center">
        <p className="text-slate-400 text-sm">Mapu se nepodařilo načíst. Zkuste to znovu později.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map container */}
      <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden border border-white/10">
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Loading state */}
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/[0.02]">
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
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-black/60 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-white/20">
                {hint || "Klikni na mapu pro umístění pinu"}
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
