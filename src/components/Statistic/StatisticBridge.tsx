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
import DetailBridgeBaik from "@/components/Statistic/DetailBridgeBaik.tsx";
import DetailBridgeSedang from "@/components/Statistic/DetailBridgeSedang.tsx";
import DetailBridgeRR from "@/components/Statistic/DetailBridgeRR.tsx";
import DetailBridgeRB from "@/components/Statistic/DetailBridgeRB.tsx";

Chart.register(CategoryScale);

interface TypeOfPavement {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

const StatisticBridge = ({ year }: { year: string }) => {
  const [chartData, setChartData] = useState<TypeOfPavement | null>(null);
  const [result, setResult] = useState<any>("");
  const [keys, setKeys] = useState<string[]>([]);
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const statsTypeOfPavement = "statistic_jembatan";
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

        const data = response.data.data.kondisi_count;
        setResult(data);
        const key = Object.keys(data);
        setKeys(key);

        const chart = {
          labels: ["Baik", "Sedang", "Rusak Ringan", "Rusak Berat"],
          datasets: [
            {
              data: [data.B, data.S, data.RR, data.RB],
              backgroundColor: ["#26d532", "#074be3", "#f3e700", "#f84d07"],
              hoverBackgroundColor: [
                "#0cb718",
                "#0034b2",
                "#cbc100",
                "#e04304",
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

  return (
    <div className="w-full md:w-[80vh] xl:w-full">
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-lg text-biru font-medium">Kondisi Jembatan</h3>
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
                <Button className="text-xs bg-[#26d532] hover:bg-[#0cb718] text-black font-light shadow-md">
                  Baik
                </Button>
              </DialogTrigger>
              <DetailBridgeBaik kondisi={keys[0]} year={year} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-[#074be3] hover:bg-[#0034b2] text-black font-light shadow-md">
                  Sedang
                </Button>
              </DialogTrigger>
              <DetailBridgeSedang kondisi={keys[1]} year={year} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-[#f3e700] hover:bg-[#cbc100] text-black font-light shadow-md">
                  Rusak Ringan
                </Button>
              </DialogTrigger>
              <DetailBridgeRR kondisi={keys[2]} year={year} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-[#f84d07] hover:bg-[#e04304] text-black font-light shadow-md">
                  Rusak Berat
                </Button>
              </DialogTrigger>
              <DetailBridgeRB kondisi={keys[3]} year={year} />
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
              <TableHead>Rusak Ringan</TableHead>
              <TableHead>Rusak Berat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="truncate">{result.B || 0}</TableCell>
              <TableCell className="truncate">{result.S || 0}</TableCell>
              <TableCell className="truncate">{result.RR || 0}</TableCell>
              <TableCell className="truncate">{result.RB || 0}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StatisticBridge;
