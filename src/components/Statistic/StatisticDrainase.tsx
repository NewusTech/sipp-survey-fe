import { Button } from "@/components/ui/button.tsx";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import DetailDrainaseBaik from "@/components/Statistic/DetailDrainaseBaik.tsx";
import DetailDrainaseSedang from "@/components/Statistic/DetailDrainaseSedang.tsx";
import DetailDrainaseRusak from "@/components/Statistic/DetailDrainaseRusak.tsx";
import DetailDrainaseTanah from "@/components/Statistic/DetailDrainaseTanah.tsx";

Chart.register(CategoryScale);

interface TypeOfPavement {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

const StatisticDrainase = ({ year }: { year: string }) => {
  const [chartData, setChartData] = useState<TypeOfPavement | null>(null);
  const [result, setResult] = useState<any>("");
  const [keys, setKeys] = useState<string[]>([]);
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const statsTypeOfPavement = "statistic_drainase";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/${statsTypeOfPavement}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            year: year,
          },
        });

        const data = response.data.data;
        setResult(data);
        const key = Object.keys(data);
        setKeys(key);

        console.log(data);

        const chart = {
          labels: ["Baik", "Sedang", "Rusak", "Tanah"],
          datasets: [
            {
              data: [data.baik, data.sedang, data.rusak, data.tanah],
              backgroundColor: ["#00d9ff", "#ff8a00", "#f3002d", "#12e100"],
              hoverBackgroundColor: [
                "#0098b7",
                "#d37200",
                "#be0024",
                "#11b200",
              ],
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
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const isDataEmpty = (data: any) => {
    return data.every((value: any) => value === 0);
  };

  console.log(result);

  return (
    <div className="w-full md:w-[80vh] xl:w-full">
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-lg text-biru font-medium">Kondisi Drainase</h3>
        <div className="flex flex-col items-center justify-center my-6 gap-5">
          <div className="w-48 h-48 mt-10">
            {chartData && !isDataEmpty(chartData.datasets[0].data) ? (
              <Doughnut data={chartData} options={options} />
            ) : (
              <p className="text-center text-black w-full">
                Tidak ada data pada tahun {year}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-[#00d9ff] hover:bg-[#0098b7] text-black font-light shadow-md">
                  Baik
                </Button>
              </DialogTrigger>
              <DetailDrainaseBaik kondisi={keys[0]} year={year} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-[#ff8a00] hover:bg-[#d37200] text-black font-light shadow-md">
                  Sedang
                </Button>
              </DialogTrigger>
              <DetailDrainaseSedang kondisi={keys[1]} year={year} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-[#f3002d] hover:bg-[#be0024] text-black font-light shadow-md">
                  Rusak
                </Button>
              </DialogTrigger>
              <DetailDrainaseRusak kondisi={keys[2]} year={year} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-[#12e100] hover:bg-[#11b200] text-black font-light shadow-md">
                  Tanah
                </Button>
              </DialogTrigger>
              <DetailDrainaseTanah kondisi={keys[3]} year={year} />
            </Dialog>
          </div>
        </div>
      </div>
      <div className="bg-white mt-6 rounded-xl p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Baik</TableHead>
              <TableHead>Sedang</TableHead>
              <TableHead>Rusak</TableHead>
              <TableHead>Tanah</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="truncate">{result.baik || 0} </TableCell>
              <TableCell className="truncate">{result.sedang || 0} </TableCell>
              <TableCell className="truncate">{result.rusak || 0} </TableCell>
              <TableCell className="truncate">{result.tanah || 0}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StatisticDrainase;
