import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapModalProps {
  latitude: number | null;
  longitude: number | null;
  name: string;
  onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({
  latitude,
  longitude,
  name,
  onClose,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Check if coordinates are provided
    if (
      latitude === null ||
      longitude === null ||
      isNaN(latitude) ||
      isNaN(longitude)
    ) {
      setError("Barangay location is missing. Please provide valid coordinates.");
      return;
    }

    if (!mapRef.current || leafletMap.current) return;

    try {
      // ✅ Initialize Leaflet map
      const mapInstance = L.map(mapRef.current, {
        center: [latitude, longitude],
        zoom: 13,
      });

      // ✅ Add tile layer (OpenStreetMap – free)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      // ✅ Add destination marker
      L.marker([latitude, longitude])
        .addTo(mapInstance)
        .bindPopup(`<b>${name}</b><br>Destination`)
        .openPopup();

      leafletMap.current = mapInstance;
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Failed to load map. Please try again later.");
    }

    // ✅ Cleanup on unmount
    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, [latitude, longitude, name]);

  const handleGetDirections = () => {
    // ✅ Prevent directions if coordinates missing
    if (
      latitude === null ||
      longitude === null ||
      isNaN(latitude) ||
      isNaN(longitude)
    ) {
      setError("Cannot get directions — barangay coordinates are missing.");
      return;
    }

    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        if (leafletMap.current) {
          // ✅ Clear previous lines and markers
          leafletMap.current.eachLayer((layer) => {
            if (layer instanceof L.Polyline || layer instanceof L.Marker) {
              leafletMap.current?.removeLayer(layer);
            }
          });

          // ✅ Add tile layer again
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
          }).addTo(leafletMap.current);

          // ✅ Add current and destination markers
          L.marker([userLat, userLng])
            .addTo(leafletMap.current)
            .bindPopup("📍 Your Location")
            .openPopup();

          L.marker([latitude, longitude])
            .addTo(leafletMap.current)
            .bindPopup(`<b>${name}</b><br>Destination`);

          // ✅ Draw line between points
          const line = L.polyline(
            [
              [userLat, userLng],
              [latitude, longitude],
            ],
            { color: "blue", weight: 4, opacity: 0.7 }
          ).addTo(leafletMap.current);

          leafletMap.current.fitBounds(line.getBounds(), { padding: [50, 50] });
        }

        setError(null);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError(
          "Unable to get your current location. Please allow location permission."
        );
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-3xl w-full relative">
        <h2 className="text-2xl font-semibold mb-4 text-center">{name}</h2>

        {/* Error message or map display */}
        {error ? (
          <div className="w-full h-[400px] flex items-center justify-center border border-gray-300 rounded-xl bg-gray-100">
            <p className="text-red-600 font-medium text-center px-4">
              {error}
            </p>
          </div>
        ) : (
          <div
            ref={mapRef}
            className="w-full h-[400px] rounded-xl mb-4"
            id={`map-${name.replace(/\s+/g, "-")}`}
          ></div>
        )}

        <div className="flex justify-between mt-4">
          <button
            onClick={handleGetDirections}
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
            disabled={!!error}
          >
            Get Directions
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
