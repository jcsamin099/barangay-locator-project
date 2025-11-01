// src/pages/ResidentNavigatePage.tsx
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

interface Barangay {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
}

const ResidentNavigatePage: React.FC = () => {
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const mapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  // 🔹 Fetch barangays
  useEffect(() => {
    const fetchBarangays = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/barangays");
        const data = await res.json();
        setBarangays(data);
      } catch (err) {
        console.error("Failed to fetch barangays:", err);
      }
    };
    fetchBarangays();
  }, []);

  // 🔹 Initialize map
  useEffect(() => {
    if (mapRef.current || typeof window === "undefined") return;

    const map = L.map("resident-map", {
      center: [14.5995, 120.9842],
      zoom: 12,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapRef.current = map;

    // ✅ Fix rendering issues after layout/resize (especially mobile)
    const handleResize = () => {
      setTimeout(() => map.invalidateSize(), 300);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 🔹 Add barangay markers and auto-fit
  useEffect(() => {
    if (!mapRef.current || barangays.length === 0) return;
    const map = mapRef.current;

    // Remove old markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && !(layer instanceof L.CircleMarker)) {
        map.removeLayer(layer);
      }
    });

    const markers: L.LatLngExpression[] = [];

    barangays.forEach((barangay) => {
      if (barangay.latitude && barangay.longitude) {
        const marker = L.marker([barangay.latitude, barangay.longitude])
          .addTo(map)
          .bindPopup(
            `<b>${barangay.name}</b><br>${barangay.description || ""}`
          );
        markers.push([barangay.latitude, barangay.longitude]);
      }
    });

    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Ensure map is drawn properly after markers load
    setTimeout(() => {
      map.invalidateSize();
    }, 500);
  }, [barangays]);

  // 🔹 Get directions
  const handleGetDirections = (barangay: Barangay) => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        if (routingControlRef.current) {
          mapRef.current?.removeControl(routingControlRef.current);
        }

        const routing = L.Routing.control({
          waypoints: [
            L.latLng(userLat, userLng),
            L.latLng(barangay.latitude, barangay.longitude),
          ],
          routeWhileDragging: false,
          lineOptions: {
            styles: [{ color: "blue", weight: 4, opacity: 0.8 }],
          },
          createMarker: (i, wp, nWps) => {
            if (i === 0)
              return L.marker(wp.latLng).bindPopup("📍 You are here");
            else
              return L.marker(wp.latLng).bindPopup(`🏠 ${barangay.name}`);
          },
        }).addTo(mapRef.current!);

        routingControlRef.current = routing;
      },
      (err) => {
        console.error("Location error:", err);
        alert(
          "Unable to get your current location. Please allow location access."
        );
      }
    );
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 p-4 md:p-6 relative z-0">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Barangay Locator
      </h1>

      {/* 🗺️ Map Area */}
      <div
        className="
          w-full max-w-6xl 
          h-[75vh] sm:h-[80vh] md:h-[85vh] 
          min-h-[400px] 
          rounded-2xl overflow-hidden shadow-xl mb-10 border border-gray-200
          relative z-0
        "
      >
        <div
          id="resident-map"
          className="w-full h-full rounded-2xl touch-pan-y touch-pan-x"
        ></div>
      </div>

      {/* 🧭 Barangay Cards */}
      <div className="w-full max-w-6xl relative z-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Available Barangays
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barangays.length > 0 ? (
            barangays.map((barangay) => (
              <div
                key={barangay._id}
                className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {barangay.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {barangay.description || "No description provided."}
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleGetDirections(barangay)}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center col-span-full">
              No barangays available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentNavigatePage;
