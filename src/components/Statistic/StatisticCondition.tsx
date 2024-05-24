import { Button } from "@/components/ui/button.tsx";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import DetailDataRusakRingan from "@/components/Statistic/DetailDataRusakRingan.tsx";
import DetailDataBaik from "@/components/Statistic/DetailDataBaik.tsx";
import DetailDataSedang from "@/components/Statistic/DetailDataSedang.tsx";
import DetailDataRusakBerat from "@/components/Statistic/DetailDataRusakBerat.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";

interface TypeOfPavement {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

const StatisticCondition = ({ year }: { year: string }) => {
  const [chartData, setChartData] = useState<TypeOfPavement | null>(null);

  const [result, setResult] = useState<any>("");
  const [mantap, setMantap] = useState<number>(0);
  const [tidakMantap, setTidakMantap] = useState<number>(0);
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const statsConditionPavement = "laporan/statistik/kondisi_perkerasan";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/${statsConditionPavement}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = response.data.data;
        setResult(data);
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

        // setTotal(data);

        const chart = {
          labels: ["Baik", "Sedang", "Rusak Ringan", "Rusak Berat"],
          datasets: [
            {
              data: [
                Math.floor(data.baik_percentage),
                Math.floor(data.sedang_percentage),
                Math.floor(data.rusak_ringan_percentage),
                Math.floor(data.rusak_berat_percentage),
              ],

              backgroundColor: ["#78FF81", "#F2FF78", "#FFD778", "#FF7878"],
              hoverBackgroundColor: [
                "#2fc03a",
                "#ecf855",
                "#daaf43",
                "#d14f4f",
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
        <h3 className="text-lg text-biru font-medium pb-10">
          Kondisi Perkerasan
        </h3>
        <div className="flex flex-col items-center justify-center my-6 gap-5">
          <div className="w-48 h-48">
            {chartData && <Doughnut data={chartData} options={options} />}
          </div>
          <div className="grid grid-cols-4 gap-2 px-10">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-baik hover:bg-baik-2 text-black font-light shadow-md">
                  Baik
                </Button>
              </DialogTrigger>
              <DetailDataBaik year={year} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-sedang hover:bg-sedang-2 text-black font-light shadow-md">
                  Sedang
                </Button>
              </DialogTrigger>
              <DetailDataSedang year={year} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-rusak-1 hover:bg-rusak-1-1 text-black font-light shadow-md whitespace-normal">
                  Rusak Ringan
                </Button>
              </DialogTrigger>
              <DetailDataRusakRingan year={year} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xs bg-rusak-2 hover:bg-rusak-2-1 text-black font-light shadow-md whitespace-normal">
                  Rusak Berat
                </Button>
              </DialogTrigger>
              <DetailDataRusakBerat year={year} />
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
              <TableHead>Mantap</TableHead>
              <TableHead>Tidak Mantap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{result.baik_percentage || 0}%</TableCell>
              <TableCell>{result.sedang_percentage || 0}%</TableCell>
              <TableCell>{result.rusak_ringan_percentage || 0}%</TableCell>
              <TableCell>{result.rusak_berat_percentage || 0}%</TableCell>
              <TableCell>{mantap}%</TableCell>
              <TableCell>{tidakMantap}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StatisticCondition;
