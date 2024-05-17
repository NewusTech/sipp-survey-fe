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

interface LapenSection {
  id: number;
  kecamatan: string;
  no_ruas: string;
  lapen: number;
  ruas_jalan: string;
}

interface LapenData {
  data: LapenSection[];
  total: number;
}

const DetailDataLapen = ({ year }: { year: string }) => {
  const [lapenData, setLapenData] = useState<LapenData>({
    data: [],
    total: 0,
  });

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const lapen = "laporan/statistik/lapen";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    axios
      .get(`${apiUrl}/${lapen}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          year: year,
        },
      })
      .then((response) => {
        setLapenData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [year]);

  return (
    <DialogContent className="overflow-scroll flex flex-col w-full md:w-[550px] md:h-[500px]">
      <DialogHeader>
        <DialogTitle>Ruas Jalan Dengan Bahan Lapen Tahun {year}</DialogTitle>
      </DialogHeader>
      <Table className="bg-white rounded-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] truncate">No Ruas</TableHead>
            <TableHead className="w-[100px] truncate">
              Nama Ruas Jalan
            </TableHead>
            <TableHead>Kecamatan</TableHead>
            <TableHead className="truncate">Lapen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(lapenData)
            .slice(0, -1)
            .map(({ no_ruas, ruas_jalan, kecamatan, lapen }, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{no_ruas}</TableCell>
                <TableCell className="truncate">{ruas_jalan}</TableCell>
                <TableCell>{kecamatan || "-"}</TableCell>
                <TableCell>{lapen}</TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell colSpan={3} className="text-center font-medium">
              Total Lapen
            </TableCell>
            <TableCell className="font-medium">
              {lapenData.total || 0}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </DialogContent>
  );
};

export default DetailDataLapen;
