import React, { useCallback, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngTuple } from "leaflet";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

const MapSearch: React.FC<{
  onLatLongChange: (lat: number, long: number) => void;
  defaultLat: number;
  defaultLng: number;
}> = ({ onLatLongChange, defaultLat, defaultLng }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [markerPosition, setMarkerPosition] = useState<LatLngTuple | null>(
    null,
  );
  const [draggable, setDraggable] = useState(false);

  const [mapCenter, setMapCenter] = useState<LatLngTuple>([
    defaultLat,
    defaultLng,
  ]); // Default center
  const [mapZoom, setMapZoom] = useState<number>(10); // Default zoom level

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      );

      if (!response.ok) {
        throw new Error("Gagal melakukan pencarian.");
      }

      const data = await response.json();

      if (data.length > 0) {
        const firstResult = data[0];
        const { lat, lon } = firstResult;
        setMarkerPosition([Number(lat), Number(lon)]);
        setMapCenter([Number(lat), Number(lon)]);
        setMapZoom(13); // Zoom level yang diinginkan
        onLatLongChange(Number(lat), Number(lon));
      } else {
        setMarkerPosition(null);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const myIcon = L.icon({
    iconUrl: "assets/icons/map.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker: any = markerRef.current;
        if (marker != null) {
          setMarkerPosition(marker.getLatLng());
        }
      },
    }),
    [],
  );
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <div className="relative w-full z-10">
      <div className="flex mb-10 gap-5 md:gap-10 md:flex-row flex-col items-center">
        <div className="flex flex-col gap-3">
          <label htmlFor="" className="font-medium text-sm">
            Alamat
          </label>
          <Input
            type="text"
            value={searchQuery}
            className="border-b-2 rounded-none md:w-[600px]"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Masukkan alamat lengkap tidak boleh disingkat..."
          />
        </div>
        <Button
          type="button"
          className="rounded-full bg-biru hover:bg-biru-2"
          onClick={handleSearch}
        >
          Cari Alamat
        </Button>
      </div>

      {/* Tambahkan MapContainer */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Tampilkan Marker jika markerPosition tidak null */}
        {markerPosition && (
          <Marker
            ref={markerRef}
            draggable={draggable}
            eventHandlers={eventHandlers}
            position={markerPosition}
            icon={myIcon}
          >
            <Popup>
              <span onClick={toggleDraggable}>
                {draggable ? (
                  "Marker bisa digeser"
                ) : (
                  <p>
                    Click <span className="text-blue-500">disini</span> untuk
                    membuat marker bisa digeser
                  </p>
                )}
              </span>
            </Popup>
          </Marker>
        )}

        <CustomMapFocus markerPosition={markerPosition} />
      </MapContainer>
    </div>
  );
};

// Komponen baru untuk mengatur fokus peta
const CustomMapFocus: React.FC<{ markerPosition: LatLngTuple | null }> = ({
  markerPosition,
}) => {
  const map = useMap(); // Menggunakan useMap hook untuk mengakses objek map

  // Set fokus ke markerPosition saat markerPosition berubah
  React.useEffect(() => {
    if (markerPosition) {
      map.setView(markerPosition, 20);
    }
  }, [markerPosition, map]);

  return null; // Komponen ini tidak merender apa pun di DOM
};

export default MapSearch;
