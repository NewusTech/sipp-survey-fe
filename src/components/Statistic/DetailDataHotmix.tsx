import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";

interface HotmixSection {
  id: number;
  kecamatan: string;
  no_ruas: string;
  hotmix: number;
  ruas_jalan: string;
}

interface HotmixData {
  data: HotmixSection[];
  total: number;
}

const DetailDataHotmix = ({ year }: { year: string }) => {
  const [hotmixData, setHotmixData] = useState<HotmixData>({
    data: [],
    total: 0,
  });

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const hotmix = "laporan/statistik/hotmix";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    axios
      .get(`${apiUrl}/${hotmix}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          year: year,
        },
      })
      .then((response) => {
        setHotmixData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [year]);

  return (
    <DialogContent className="overflow-scroll flex flex-col w-full md:w-[550px] md:h-[500px]">
      <DialogHeader>
        <DialogTitle>Ruas Jalan Dengan Bahan Hotmix Tahun {year}</DialogTitle>
      </DialogHeader>
      <Table className="bg-white rounded-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] truncate">No Ruas</TableHead>
            <TableHead className="w-[100px] truncate">
              Nama Ruas Jalan
            </TableHead>
            <TableHead>Kecamatan</TableHead>
            <TableHead className="truncate">Hotmix</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(hotmixData)
            .slice(0, -1)
            .map(({ no_ruas, ruas_jalan, kecamatan, hotmix }, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{no_ruas}</TableCell>
                <TableCell className="truncate">{ruas_jalan}</TableCell>
                <TableCell>{kecamatan || "-"}</TableCell>
                <TableCell>{hotmix}</TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell colSpan={3} className="text-center font-medium">
              Total Hotmix
            </TableCell>
            <TableCell className="font-medium">
              {hotmixData.total || 0}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </DialogContent>
  );
};

export default DetailDataHotmix;
