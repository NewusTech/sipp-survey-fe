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
  nama_jembatan?: string;
  kondisi_ba?: string;
  kondisi_bb?: string;
  kondisi_fondasi?: string;
  kondisi_lantai?: string;
  kecamatan?: string;
  nilai_kondisi?: number;
  kondisi?: string;
  panjang_ruas?: string;
}

// Buat peta dengan marker
const MapWithMarkers = ({ year }: { year: string }) => {
  const [mapPointDataBridge, setMapPointDataBridge] = useState<LatLong[]>([]);

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const mapsPointBridge = "dashboard/maps_jembatan";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    axios
      .get(`${apiUrl}/${mapsPointBridge}`, {
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

  // Konfigurasi ikon marker kustom

  const myIcon2 = L.icon({
    iconUrl: "assets/icons/map-red.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <MapContainer
      center={[-4.43242555, 105.16826426180435]}
      zoom={10}
      style={{ height: "40vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {mapPointDataBridge.map((point, index) => (
        <Marker
          key={index}
          position={[parseFloat(point.latitude!), parseFloat(point.longitude!)]}
          icon={myIcon2}
        >
          <Popup>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <h1 className="text-[8px] font-bold">Nama Ruas</h1>
                <h2 className="text-[8px]">{point.nama_ruas}</h2>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[8px] font-bold">Nama Jembatan</h1>
                <h2 className="text-[8px]">{point.nama_jembatan}</h2>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[8px] font-bold">Kecamatan</h1>
                <h2 className="text-[8px]">{point.kecamatan}</h2>
              </div>
              <div className="flex flex-row gap-3">
                <div className="flex flex-col">
                  <h1 className="text-[8px] font-bold">Nilai Kondisi</h1>
                  <h2 className="text-[8px]">{point.nilai_kondisi}</h2>
                </div>
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
