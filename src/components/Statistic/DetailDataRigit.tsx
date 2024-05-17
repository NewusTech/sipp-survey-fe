import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

interface RigitSection {
  id: number;
  kecamatan: string;
  no_ruas: string;
  rigit: number;
  ruas_jalan: string;
}

interface RigitData {
  data: RigitSection[];
  total: number;
}
const DetailDataRigit = ({ year }: { year: string }) => {
  const [rigitData, setRigitData] = useState<RigitData>({
    data: [],
    total: 0,
  });

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const rigit = "laporan/statistik/rigit";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    axios
      .get(`${apiUrl}/${rigit}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          year: year,
        },
      })
      .then((response) => {
        setRigitData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [year]);

  return (
    <DialogContent className="overflow-scroll flex flex-col w-full md:w-[550px] md:h-[500px]">
      <DialogHeader>
        <DialogTitle>Ruas Jalan Dengan Bahan Rigit Tahun {year}</DialogTitle>
      </DialogHeader>
      <Table className="bg-white rounded-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] truncate">No</TableHead>
            <TableHead className="w-[100px] truncate">
              Nama Ruas Jalan
            </TableHead>
            <TableHead>Kecamatan</TableHead>
            <TableHead className="truncate">Rigit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(rigitData)
            .slice(0, -1)
            .map(({ no_ruas, ruas_jalan, kecamatan, rigit }, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{no_ruas}</TableCell>
                <TableCell className="truncate">{ruas_jalan}</TableCell>
                <TableCell>{kecamatan || "-"}</TableCell>
                <TableCell>{rigit}</TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell colSpan={3} className="text-center font-medium">
              Total Rigit
            </TableCell>
            <TableCell className="font-medium">
              {rigitData.total || 0}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </DialogContent>
  );
};

export default DetailDataRigit;
