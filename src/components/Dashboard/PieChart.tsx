import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import DetailDataBaik from "@/components/Statistic/DetailDataBaik.tsx";
import DetailDataSedang from "@/components/Statistic/DetailDataSedang.tsx";
import DetailDataRusakRingan from "@/components/Statistic/DetailDataRusakRingan.tsx";
import DetailDataRusakBerat from "@/components/Statistic/DetailDataRusakBerat.tsx";

Chart.register(CategoryScale);

interface ChartDataItem {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
}

const PieChart = ({ year }: { year: string }) => {
  const [chartData, setChartData] = useState<ChartDataItem | null>(null);

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const pieChart = "dashboard/piechart";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/${pieChart}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            year: year,
          },
        });

        const data = response.data.data;

        console.log(data);

        // setTotal(data);

        const chart = {
          labels: ["Baik", "Sedang", "Rusak Ringan", "Rusak Berat"],
          datasets: [
            {
              label: "Nilai Kondisi",
              data: [
                data.baik,
                data.sedang,
                data.rusak_ringan,
                data.rusak_berat,
              ],
              backgroundColor: ["#FFD580", "#FF80AF", "#9CFF80", "#80DCFF"],
            },
          ],
        };

        setChartData(chart);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.log(error);
      }
    };

    fetchData();
  }, [year]);

  const options = {
    responsive: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  console.log(chartData);

  return (
    <div className="w-full flex flex-col">
      <h1 className="text-gray-500 ml-2 mb-2">Data chart pada tahun {year}</h1>
      {chartData &&
      chartData.datasets &&
      chartData.datasets[0].data.some((item: any) => item !== "") ? (
        <div className="flex md:flex-row flex-col justify-center md:-ml-36 items-center gap-5">
          <Pie data={chartData} options={options} />
          <div className="flex md:flex-col flex-row md:gap-3 gap-2 md:-ml-36">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-[#FFD580] hover:bg-[#FFCD67] text-black font-light shadow-md">
                  Baik
                </Button>
              </DialogTrigger>
              <DetailDataBaik year={year} />
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-[#FF80AF] hover:bg-[#FD6CA2] text-black font-light shadow-md">
                  Sedang
                </Button>
              </DialogTrigger>
              <DetailDataSedang year={year} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-[#9CFF80] hover:bg-[#8DFF6D] text-black font-light shadow-md whitespace-normal">
                  Rusak Ringan
                </Button>
              </DialogTrigger>
              <DetailDataRusakRingan year={year} />
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-[#80DCFF] hover:bg-[#69D6FF] text-black font-light shadow-md whitespace-normal">
                  Rusak Berat
                </Button>
              </DialogTrigger>
              <DetailDataRusakBerat year={year} />
            </Dialog>
          </div>
        </div>
      ) : (
        <div className="ml-2 mb-2 flex justify-center items-center h-[240px]">
          <p>Data tidak tersedia.</p>
        </div>
      )}
    </div>
  );
};

export default PieChart;
