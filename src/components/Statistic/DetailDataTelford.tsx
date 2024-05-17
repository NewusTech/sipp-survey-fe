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

interface TelfordSection {
  id: number;
  kecamatan: string;
  no_ruas: string;
  telford: number;
  ruas_jalan: string;
}

interface TelfordData {
  data: TelfordSection[];
  total: number;
}

const DetailDataTelford = ({ year }: { year: string }) => {
  const [telfordData, setTelfordData] = useState<TelfordData>({
    data: [],
    total: 0,
  });

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const telford = "laporan/statistik/telford";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    axios
      .get(`${apiUrl}/${telford}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          year: year,
        },
      })
      .then((response) => {
        setTelfordData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [year]);

  return (
    <DialogContent className="overflow-scroll flex flex-col w-full md:w-[550px] md:h-[500px]">
      <DialogHeader>
        <DialogTitle>Ruas Jalan Dengan Bahan Telford Tahun {year}</DialogTitle>
      </DialogHeader>
      <Table className="bg-white rounded-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] truncate">No Ruas</TableHead>
            <TableHead className="w-[100px] truncate">
              Nama Ruas Jalan
            </TableHead>
            <TableHead>Kecamatan</TableHead>
            <TableHead className="truncate">Telford</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(telfordData)
            .slice(0, -1)
            .map(({ no_ruas, ruas_jalan, kecamatan, telford }, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{no_ruas}</TableCell>
                <TableCell className="truncate">{ruas_jalan}</TableCell>
                <TableCell>{kecamatan || "-"}</TableCell>
                <TableCell>{telford}</TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell colSpan={3} className="text-center font-medium">
              Total Telford
            </TableCell>
            <TableCell className="font-medium">
              {telfordData.total || 0}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </DialogContent>
  );
};

export default DetailDataTelford;
