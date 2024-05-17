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

interface RusakRinganSection {
  id: number;
  kecamatan: string;
  no_ruas: string;
  rusak_ringan: number;
  ruas_jalan: string;
}

interface RusakRinganData {
  data: RusakRinganSection[];
  total: number;
}

const DetailDataRusakRingan = ({ year }: { year: string }) => {
  const [rusakRinganData, setRusakRinganData] = useState<RusakRinganData>({
    data: [],
    total: 0,
  });

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const rusakRingan = "laporan/statistik/rusak_ringan";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    axios
      .get(`${apiUrl}/${rusakRingan}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          year: year,
        },
      })
      .then((response) => {
        setRusakRinganData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [year]);

  return (
    <DialogContent className="overflow-scroll flex flex-col w-full md:w-[550px] md:h-[500px]">
      <DialogHeader>
        <DialogTitle>
          Ruas Jalan Dengan Bahan Rusak Ringan Tahun {year}
        </DialogTitle>
      </DialogHeader>
      <Table className="bg-white rounded-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] truncate">No Ruas</TableHead>
            <TableHead className="w-[100px] truncate">
              Nama Ruas Jalan
            </TableHead>
            <TableHead>Kecamatan</TableHead>
            <TableHead className="truncate">Rusak Ringan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(rusakRinganData)
            .slice(0, -1)
            .map(({ no_ruas, ruas_jalan, kecamatan, rusak_ringan }, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{no_ruas}</TableCell>
                <TableCell className="truncate">{ruas_jalan}</TableCell>
                <TableCell>{kecamatan || "-"}</TableCell>
                <TableCell>{rusak_ringan}</TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell colSpan={3} className="text-center font-medium">
              Total Rusak Ringan
            </TableCell>
            <TableCell className="font-medium">
              {rusakRinganData.total || 0}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </DialogContent>
  );
};

export default DetailDataRusakRingan;
