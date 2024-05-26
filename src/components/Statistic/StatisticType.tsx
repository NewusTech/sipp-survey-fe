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
          params: {
            year: year,
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
                Number(data.hotmix_count) || 0,
                Number(data.rigit_count) || 0,
                Number(data.lapen_count) || 0,
                Number(data.telford_count) || 0,
                Number(data.tanah_count) || 0,
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
  }, [year]);

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // const isDataEmpty = (data: any) => {
  //   return data.every((value: any) => value === 0);
  // };

  return (
    <div className="w-full md:w-[80vh] xl:w-[49%]">
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-lg text-biru font-medium">
          Jenis Perkerasan Jalan
        </h3>
        <div className="flex flex-col items-center justify-center my-6 gap-5">
          <div className="w-48 h-48 mt-10">
            {chartData === null ? (
              <p className="text-center text-black w-full">
                Tidak ada data pada tahun {year}
              </p>
            ) : (
              <Doughnut data={chartData} options={options} />
            )}
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
            {result ? (
              <TableRow>
                <TableCell className="truncate">
                  {result.hotmix_count || 0} M
                </TableCell>
                <TableCell className="truncate">
                  {result.rigit_count || 0} M
                </TableCell>
                <TableCell className="truncate">
                  {result.lapen_count || 0} M
                </TableCell>
                <TableCell className="truncate">
                  {result.telford_count || 0} M
                </TableCell>
                <TableCell className="truncate">
                  {result.tanah_count || 0} M
                </TableCell>
                <TableCell className="truncate">{total || 0} KM</TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-black">
                  Tidak ada data pada tahun {year}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StatisticType;
