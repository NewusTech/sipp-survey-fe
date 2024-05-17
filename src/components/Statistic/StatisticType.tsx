import { Button } from "@/components/ui/button.tsx";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import DetailDataHotmix from "@/components/Statistic/DetailDataHotmix.tsx";
import DetailDataRigit from "@/components/Statistic/DetailDataRigit.tsx";
import DetailDataLapen from "@/components/Statistic/DetailDataLapen.tsx";
import DetailDataTelford from "@/components/Statistic/DetailDataTelford.tsx";
import DetailDataTanah from "@/components/Statistic/DetailDataTanah.tsx";
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

Chart.register(CategoryScale);

interface TypeOfPavement {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

const StatisticType = ({ year }: { year: string }) => {
  const [chartData, setChartData] = useState<TypeOfPavement | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [result, setResult] = useState<any>("");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const statsTypeOfPavement = "laporan/statistik/jenis_perkerasan";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/${statsTypeOfPavement}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.data;
        setResult(data);
        setTotal(data.total);

        const chart = {
          labels: ["Hotmix", "Rigit", "Lapen", "Telford", "Tanah"],
          datasets: [
            {
              data: [
                Number(data.hotmix_count),
                Number(data.rigit_count),
                Number(data.lapen_count),
                Number(data.telford_count),
                Number(data.tanah_count),
              ],
              backgroundColor: [
                "#AEAEAE",
                "#D9C32F",
                "#F3AB00",
                "#FF7878",
                "#B58500",
              ],
              hoverBackgroundColor: [
                "#808080",
                "#9e8e0f",
                "#bc8600",
                "#dc5151",
                "#926b00",
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
  }, []);

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-lg text-biru font-medium">Jenis Perkerasan</h3>
        <div className="flex flex-col items-center justify-center my-6 gap-5">
          <div className="w-48 h-48 mt-10">
            {chartData && <Doughnut data={chartData} options={options} />}
          </div>
          <div className="grid grid-cols-5 gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-abu-3 hover:bg-abu-4 text-black font-light shadow-md">
                  Hotmix
                </Button>
              </DialogTrigger>
              <DetailDataHotmix year={year} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-rigit hover:bg-rigit-2 text-black font-light shadow-md">
                  Rigit
                </Button>
              </DialogTrigger>
              <DetailDataRigit year={year} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-lapen hover:bg-lapen-2 text-black font-light shadow-md">
                  Lapen
                </Button>
              </DialogTrigger>
              <DetailDataLapen year={year} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-onderlag hover:bg-onderlag-2 text-black font-light shadow-md">
                  Telford
                </Button>
              </DialogTrigger>
              <DetailDataTelford year={year} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-tanah hover:bg-tanah-2 text-black font-light shadow-md">
                  Tanah
                </Button>
              </DialogTrigger>
              <DetailDataTanah year={year} />
            </Dialog>
          </div>
        </div>
      </div>
      <div className="bg-white mt-6 rounded-xl p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hotmix</TableHead>
              <TableHead>Rigit</TableHead>
              <TableHead>Lapen</TableHead>
              <TableHead>Telford</TableHead>
              <TableHead>Tanah</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="truncate">
                {result.hotmix_count} M
              </TableCell>
              <TableCell className="truncate">{result.rigit_count} M</TableCell>
              <TableCell className="truncate">{result.lapen_count} M</TableCell>
              <TableCell className="truncate">
                {result.telford_count} M
              </TableCell>
              <TableCell className="truncate">{result.tanah_count} M</TableCell>
              <TableCell className="truncate">{total} KM</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StatisticType;
