import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import CircularPercentage from "@/components/shared/CircularPercentage.tsx";
import MantapModal from "@/components/Dashboard/MantapModal.tsx";
import TidakMantapModal from "@/components/Dashboard/TidakMantapModal.tsx";
import MapWithMarkers from "@/components/Dashboard/MapWithMarker.tsx";
import RoadSectionData from "@/components/Dashboard/RoadSectionData.tsx";
import { ChangeEvent, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const RoadSectionDashboard = () => {
  const [totalLongRoadSection, setTotalLongRoadSection] = useState(0);
  const [totalRoadSection, setTotalRoadSection] = useState(0);
  const [mantap, setMantap] = useState(0);
  const [tidakMantap, setTidakMantap] = useState(0);
  const [selectedYear, setSelectedYear] = useState<string>("2024");

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const kemantapan = "dashboard/kemantapan";
  const total = "dashboard";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    axios
      .get(`${apiUrl}/${kemantapan}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          year: selectedYear,
        },
      })
      .then((response) => {
        const data = response.data.data;
        const round =
          Math.abs(data.mantap % 1) >= 0.5
            ? Math.ceil(data.mantap)
            : Math.floor(data.mantap);

        const floor =
          Math.abs(data.tmantap % 1) >= 0.5
            ? Math.ceil(data.tmantap)
            : Math.floor(data.tmantap);

        setMantap(round);
        setTidakMantap(floor);
      })
      .catch((error) => {
        console.log(error);
      });

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
        <div className="w-full md:w-4/12 bg-white shadow rounded-xl">
          <div className="flex flex-col p-5 gap-5">
            <h5 className="text-gray-500">Total Panjang Jalan</h5>
            <div className="flex flex-col items-end md:mt-5">
              <h1 className="text-biru font-semibold text-3xl">
                {totalLongRoadSection.toLocaleString("id-ID") || 0}
              </h1>
              <p className="text-biru">Kilometer</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-4/12 bg-yellow-400 shadow rounded-xl">
          <div className="flex flex-col p-5 gap-5">
            <h5 className="text-white">Jumlah Ruas</h5>
            <div className="flex flex-col items-end md:mt-5">
              <h1 className="text-white font-semibold text-3xl">
                {totalRoadSection || 0}
              </h1>
              <p className="text-white">Jalan</p>
            </div>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <div className="w-full md:w-4/12 bg-red-400 shadow rounded-xl cursor-pointer">
              <div className="flex flex-col p-5 gap-5">
                <h5 className="text-white">Mantap</h5>
                <div className="flex items-center justify-between mt-3">
                  <h1 className="text-white font-semibold text-3xl">
                    {mantap || 0}
                  </h1>
                  <CircularPercentage
                    percentage={mantap || 0}
                    color="text-white"
                    color2="text-red-500"
                    // year={selectedYear}
                  />
                </div>
              </div>
            </div>
          </DialogTrigger>
          <MantapModal year={selectedYear} />
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <div className="w-full md:w-4/12 bg-blue-400 shadow rounded-xl cursor-pointer">
              <div className="flex flex-col p-5 gap-5">
                <h5 className="text-white">Tidak Mantap</h5>
                <div className="flex items-center justify-between mt-3">
                  <h1 className="text-white font-semibold text-3xl">
                    {tidakMantap}
                  </h1>
                  <CircularPercentage
                    color="text-white"
                    color2="text-blue-500"
                    percentage={tidakMantap}
                    // year={selectedYear}
                  />
                </div>
              </div>
            </div>
          </DialogTrigger>
          <TidakMantapModal year={selectedYear} />
        </Dialog>
      </div>
      <div className="mt-5 p-2 shadow relative z-0 bg-white rounded-xl">
        <MapWithMarkers year={selectedYear} />
        <div className="flex px-1 py-2 gap-3">
          <div className="flex gap-1">
            <img src="/assets/icons/map.svg" alt="ruas jalan" />
            <p>Ruas Jalan</p>
          </div>
        </div>
      </div>
      <RoadSectionData year={selectedYear} />
    </div>
  );
};

export default RoadSectionDashboard;
