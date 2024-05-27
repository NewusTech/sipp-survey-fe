import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Cookies from "js-cookie";
import axios from "axios";

interface LatLong {
  latitude: string | null;
  longitude: string | null;
  ruas_jalan?: string;
  type: string;
  nama_ruas?: string;
  nama_jembatan?: string;
  baik?: string;
  sedang?: string;
  rusak_ringan?: string;
  rusak_berat?: string;
  mantap?: string;
  tmantap?: string;
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
  const [mapPointData, setMapPointData] = useState<LatLong[]>([]);
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const mapsPoint = "dashboard/maps";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    axios
      .get(`${apiUrl}/${mapsPoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          year: year,
        },
      })
      .then((response) => {
        const data: LatLong[] = response.data.data.map((item: any) => ({
          ...item,
          type: "type1",
        }));
        const newMarkerPositions = data
          .filter((item) => item.latitude !== null && item.longitude !== null)
          .map((item) => item);
        setMapPointData(newMarkerPositions);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [year]);

  // Konfigurasi ikon marker kustom
  const myIcon = L.icon({
    iconUrl: "assets/icons/map-baik.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <MapContainer
      center={[-4.43242555, 105.16826426180435]}
      zoom={10}
      style={{ height: "80vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {mapPointData.map((point, index) => (
        <Marker
          key={index}
          position={[parseFloat(point.latitude!), parseFloat(point.longitude!)]}
          icon={myIcon}
        >
          <Popup>
            <div className="flex flex-col gap-2 w-[115px]">
              <div className="flex flex-col">
                <h1 className="text-[8px] font-bold">Nama Ruas</h1>
                <h2 className="text-[8px]">{point.ruas_jalan}</h2>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[8px] font-bold">Kecamatan</h1>
                <h2 className="text-[8px]">{point.kecamatan}</h2>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[8px] font-bold">Panjang</h1>
                <h2 className="text-[8px]">{point.panjang_ruas} KM</h2>
              </div>
              <div className="flex flex-row gap-11">
                <div className="flex flex-col">
                  <h1 className="text-[8px] font-bold">Baik</h1>
                  <h2 className="text-[8px]">{point.baik}</h2>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-[8px] font-bold">Sedang</h1>
                  <h2 className="text-[8px]">{point.sedang}</h2>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <div className="flex flex-col">
                  <h1 className="text-[8px] font-bold">Rusak Ringan</h1>
                  <h2 className="text-[8px]">{point.rusak_ringan}</h2>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-[8px] font-bold">Rusak Berat</h1>
                  <h2 className="text-[8px]">{point.rusak_berat}</h2>
                </div>
              </div>
              <div className="flex flex-row gap-8">
                <div className="flex flex-col">
                  <h1 className="text-[8px] font-bold">Mantap</h1>
                  <h2 className="text-[8px]">{point.mantap}%</h2>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-[8px] font-bold">Tidak Mantap</h1>
                  <h2 className="text-[8px]">{point.tmantap}%</h2>
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
