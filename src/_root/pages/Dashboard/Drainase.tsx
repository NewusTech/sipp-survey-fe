import { ChangeEvent, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import DrainaseData from "@/components/Dashboard/DrainaseData.tsx";
import MapWithMarkerDrainase from "@/components/Dashboard/MapWithMarkerDrainase.tsx";

const DrainaseDashboard = () => {
  const [totalLongDrainase, setTotalLongDrainase] = useState(0);
  const [totalDrainase, setTotalDrainase] = useState(0);

  const [selectedYear, setSelectedYear] = useState<string>("2024");

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const total = "dashboard/drainase";
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
        setTotalLongDrainase(data.total_panjang_ruas);
        setTotalDrainase(data.jumlah_drainase);
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
        <div className="w-full md:w-8/12 bg-yellow-300 shadow rounded-xl">
          <div className="flex flex-col p-5 gap-5">
            <h5 className="text-yellow-600">Total Panjang Drainase</h5>
            <div className="flex flex-col items-end md:mt-5">
              <h1 className="text-yellow-600 font-semibold text-3xl">
                {totalLongDrainase || 0}
              </h1>
              <p className="text-yellow-600">Meter</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-8/12 bg-slate-400 shadow rounded-xl">
          <div className="flex flex-col p-5 gap-5">
            <h5 className="text-slate-700">Jumlah Drainase</h5>
            <div className="flex flex-col items-end md:mt-5">
              <h1 className="text-slate-700 font-semibold text-3xl">
                {totalDrainase || 0}
              </h1>
              <p className="text-slate-700">Drainase</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 p-2 shadow relative z-0 bg-white rounded-xl">
        <MapWithMarkerDrainase year={selectedYear} />
        <div className="flex px-1 py-2 gap-3">
          <div className="flex gap-1 items-center">
            <img src="/assets/icons/map-baik.svg" alt="ruas jalan" />
            <p>Baik</p>
          </div>
          <div className="flex gap-1 items-center">
            <img src="/assets/icons/map-sedang.svg" alt="ruas jalan" />
            <p>Sedang</p>
          </div>
          <div className="flex gap-1 items-center">
            <img src="/assets/icons/map-rusak.svg" alt="ruas jalan" />
            <p>Rusak</p>
          </div>
          <div className="flex gap-1 items-center">
            <img src="/assets/icons/map-tanah.svg" alt="ruas jalan" />
            <p>Tanah</p>
          </div>
        </div>
      </div>
      <DrainaseData year={selectedYear} />
    </div>
  );
};

export default DrainaseDashboard;
