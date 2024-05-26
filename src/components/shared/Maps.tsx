import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngTuple } from "leaflet";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
// import { Map } from "lucide-react";

const MapSearch: React.FC<{
  onLatLongChange: (lat: number, long: number) => void;
  defaultLat: number | undefined;
  defaultLng: number | undefined;
  type?: string;
}> = ({ onLatLongChange, defaultLat, defaultLng, type }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [markerPosition, setMarkerPosition] = useState<LatLngTuple | null>(
    null,
  );
  const [draggable, setDraggable] = useState(false);
  const [mapCenter, setMapCenter] = useState<LatLngTuple>([
    -4.43242555, 105.16826426180435,
  ]); // Default center
  const [mapZoom, setMapZoom] = useState<number>(10); // Default zoom level

  useEffect(() => {
    // Fetch data based on defaultLat and defaultLng when component mounts
    if (defaultLng && defaultLat) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${defaultLat}&lon=${defaultLng}`,
          );

          if (!response.ok) {
            throw new Error("Failed to fetch data.");
          }

          const data = await response.json();
          const { lat, lon } = data;
          setMarkerPosition([Number(lat), Number(lon)]);
          setMapCenter([Number(lat), Number(lon)]);
          setMapZoom(13); // Desired zoom level
          onLatLongChange(parseFloat(lat), parseFloat(lon));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [defaultLat, defaultLng]);

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
        // Hapus marker yang ada
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
    iconUrl: "assets/icons/map-baik.svg",
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

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng;
    setMarkerPosition([Number(lat), Number(lng)]);
    onLatLongChange(Number(lat), Number(lng));
  };

  // A custom hook to handle map events
  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  return (
    <div className="relative w-full z-10">
      {type === "survey" ? (
        ""
      ) : (
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
      )}
      {/* Tambahkan MapContainer */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
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
      map.setView(markerPosition, 15);
    }
  }, [markerPosition, map]);

  return null; // Komponen ini tidak merender apa pun di DOM
};

export default MapSearch;
