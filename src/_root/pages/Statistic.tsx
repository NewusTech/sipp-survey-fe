import StatisticType from "@/components/Statistic/StatisticType.tsx";
import StatisticCondition from "@/components/Statistic/StatisticCondition.tsx";
import { ChangeEvent, useEffect, useState } from "react";

const Statistic = () => {
  const [selectedYear, setSelectedYear] = useState<string>("2024");

  useEffect(() => {
    document.title = "Laporan Statistik - SIPPP";
  }, []);

  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  return (
    <section className="bg-abu-2 w-screen h-screen overflow-scroll md:overflow-hidden">
      <div className="sm:ml-64 flex flex-col gap-5">
        <div className="container mx-auto mt-5">
          <h1 className="ml-6 text-gray-400 text-xl font-medium ">Statistik</h1>
          <div className="my-5">
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
          </div>
          <div className="flex md:flex-row flex-col gap-5 mt-10 md:mt-0">
            <StatisticType year={selectedYear} />
            <StatisticCondition year={selectedYear} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistic;
