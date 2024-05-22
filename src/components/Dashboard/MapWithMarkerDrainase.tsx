import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Cookies from "js-cookie";
import axios from "axios";

interface LatLong {
  latitude: string | null;
  longitude: string | null;
  type: string;
  nama_ruas?: string;
  nama_desa?: string;
  nama_kecamatan?: string;
  kondisi?: string;
}

// Buat peta dengan marker
const MapWithMarkers = ({ year }: { year: string }) => {
  const [mapPointDataBridge, setMapPointDataBridge] = useState<LatLong[]>([]);

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const mapsPointDrainase = "dashboard/maps_drainase";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    axios
      .get(`${apiUrl}/${mapsPointDrainase}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          year: year,
        },
      })
      .then((response) => {
        const data: LatLong[] = response.data.data.map((item: any) => ({
          ...item,
          type: "type2",
        }));

        const newMarkerPositions = data
          .filter((item) => item.latitude !== null && item.longitude !== null)
          .map((item) => item);
        setMapPointDataBridge(newMarkerPositions);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [year]);

  console.log(mapPointDataBridge);

  // Konfigurasi ikon marker kustom

  const iconMapping = {
    baik: L.icon({
      iconUrl: "assets/icons/map-baik.svg",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    sedang: L.icon({
      iconUrl: "assets/icons/map-sedang.svg",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    rusak: L.icon({
      iconUrl: "assets/icons/map-rusak.svg",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    tanah: L.icon({
      iconUrl: "assets/icons/map-tanah.svg",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
  };

  const getIconByCondition = (condition: string | undefined) => {
    switch (condition) {
      case "baik":
        return iconMapping.baik;
      case "sedang":
        return iconMapping.sedang;
      case "rusak":
        return iconMapping.rusak;
      default:
        return iconMapping.tanah;
    }
  };

  return (
    <MapContainer
      center={[-4.43242555, 105.16826426180435]}
      zoom={10}
      style={{ height: "80vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {mapPointDataBridge.map((point, index) => (
        <Marker
          key={index}
          position={[parseFloat(point.latitude!), parseFloat(point.longitude!)]}
          icon={getIconByCondition(point.kondisi)}
        >
          <Popup>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <h1 className="text-[8px] font-bold">Nama Ruas</h1>
                <h2 className="text-[8px]">{point.nama_ruas}</h2>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[8px] font-bold">Nama Desa</h1>
                <h2 className="text-[8px]">{point.nama_desa}</h2>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[8px] font-bold">Kecamatan</h1>
                <h2 className="text-[8px]">{point.nama_kecamatan}</h2>
              </div>
              <div className="flex flex-row gap-3">
                <div className="flex flex-col">
                  <h1 className="text-[8px] font-bold">Kondisi</h1>
                  <h2 className="text-[8px]">{point.kondisi}</h2>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapWithMarkers;
