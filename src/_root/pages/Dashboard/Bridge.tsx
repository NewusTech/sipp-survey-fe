import { ChangeEvent, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import BridgeSectionData from "@/components/Dashboard/BridgeSectionData.tsx";
import MapWithMarkerBridge from "@/components/Dashboard/MapWithMarkerBridge.tsx";

const BridgeDashboard = () => {
  const [totalLongRoadSection, setTotalLongRoadSection] = useState(0);
  const [totalRoadSection, setTotalRoadSection] = useState(0);
  const [selectedYear, setSelectedYear] = useState<string>("2024");

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const total = "dashboard";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    axios
      .get(`${apiUrl}/${total}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          year: selectedYear,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setTotalLongRoadSection(data.tot_panjang_jalan);
        setTotalRoadSection(data.jumlah_ruas);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedYear]);

  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div className="w-full flex md:h-full flex-col bg-abu-2 p-5">
      <div className="flex flex-wrap gap-5 justify-between items-center mb-5">
        <select
          name="year"
          className="rounded-full px-5 py-1 text-biru bg-white"
          onChange={handleYearChange}
          value={selectedYear}
        >
          <option disabled>Pilih Tahun</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
        <h1 className="px-5 py-1 rounded-full bg-white text-biru">
          Provinsi Lampung
        </h1>
        <h1 className="px-5 py-1 rounded-full bg-white text-biru">
          Kabupaten Tulang Bawang Barat
        </h1>
        <h1 className="px-5 py-1 rounded-full bg-white text-biru">
          Tahun {selectedYear}
        </h1>
      </div>
      <div className="flex md:flex-row flex-col gap-5">
        <div className="w-full md:w-8/12 bg-blue-400 shadow rounded-xl">
          <div className="flex flex-col p-5 gap-5">
            <h5 className="text-white">Total Panjang Jembatan</h5>
            <div className="flex flex-col items-end md:mt-5">
              <h1 className="text-white font-semibold text-3xl">
                {totalLongRoadSection.toLocaleString("id-ID") || 0}
              </h1>
              <p className="text-white">Kilometer</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-8/12 bg-green-500 shadow rounded-xl">
          <div className="flex flex-col p-5 gap-5">
            <h5 className="text-white">Jumlah Jembatan</h5>
            <div className="flex flex-col items-end md:mt-5">
              <h1 className="text-white font-semibold text-3xl">
                {totalRoadSection || 0}
              </h1>
              <p className="text-white">Jembatan</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 p-2 shadow relative z-0 bg-white rounded-xl">
        <MapWithMarkerBridge year={selectedYear} />
        <div className="flex px-1 py-2 gap-3">
          <div className="flex gap-1">
            <img src="/assets/icons/map-red.svg" alt="ruas jalan" />
            <p>Ruas Jembatan</p>
          </div>
        </div>
      </div>
      <BridgeSectionData year={selectedYear} />
    </div>
  );
};

export default BridgeDashboard;
