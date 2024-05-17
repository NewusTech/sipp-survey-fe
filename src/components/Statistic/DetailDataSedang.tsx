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

interface SedangSection {
  id: number;
  kecamatan: string;
  no_ruas: string;
  sedang: number;
  ruas_jalan: string;
}

interface SedangData {
  data: SedangSection[];
  total: number;
}

const DetailDataSedang = ({ year }: { year: string }) => {
  const [sedangData, setSedangData] = useState<SedangData>({
    data: [],
    total: 0,
  });

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const sedang = "laporan/statistik/sedang";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    axios
      .get(`${apiUrl}/${sedang}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          year: year,
        },
      })
      .then((response) => {
        setSedangData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [year]);

  return (
    <DialogContent className="overflow-scroll flex flex-col w-full md:w-[550px] md:h-[500px]">
      <DialogHeader>
        <DialogTitle>Ruas Jalan Dengan Bahan Sedang Tahun {year}</DialogTitle>
      </DialogHeader>
      <Table className="bg-white rounded-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] truncate">No Ruas</TableHead>
            <TableHead className="w-[100px] truncate">
              Nama Ruas Jalan
            </TableHead>
            <TableHead>Kecamatan</TableHead>
            <TableHead className="truncate">Sedang</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(sedangData)
            .slice(0, -1)
            .map(({ no_ruas, ruas_jalan, kecamatan, sedang }, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{no_ruas}</TableCell>
                <TableCell className="truncate">{ruas_jalan}</TableCell>
                <TableCell>{kecamatan || "-"}</TableCell>
                <TableCell>{sedang}</TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell colSpan={3} className="text-center font-medium">
              Total Sedang
            </TableCell>
            <TableCell className="font-medium">
              {sedangData.total || 0}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </DialogContent>
  );
};

export default DetailDataSedang;
