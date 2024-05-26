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

interface BaikSection {
  id: number;
  no_ruas: string;
  kecamatan_name: string;
  no_jembatan: string;
  panjang: string;
  lebar: string;
  nama_ruas: string;
  nama_jembatan: string;
}

const DetailDataBaik = ({
  year,
  kondisi,
}: {
  year: string;
  kondisi: string;
}) => {
  const [baikData, setBaikData] = useState<BaikSection[]>([]);

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const baik = "detail_statistic_jembatan";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    if (kondisi) {
      axios
        .get(`${apiUrl}/${baik}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            year: year,
            kondisi: kondisi,
          },
        })
        .then((response) => {
          const data = response.data.data.jembatan_berkondisi_B;
          setBaikData(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [year, kondisi]);

  return (
    <DialogContent className="overflow-scroll flex flex-col w-full md:w-full md:h-full">
      <DialogHeader>
        <DialogTitle>
          Ruas Jembatan Dengan Kondisi Baik Tahun {year}
        </DialogTitle>
      </DialogHeader>
      <Table className="bg-white rounded-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] truncate">No Ruas</TableHead>
            <TableHead>Nama Ruas Jalan</TableHead>
            <TableHead className="truncate">Nama Jembatan</TableHead>
            <TableHead className="truncate">No Jembatan</TableHead>
            <TableHead className="truncate">Panjang</TableHead>
            <TableHead className="truncate">Lebar</TableHead>
            <TableHead>Kecamatan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {baikData.map(
            (
              {
                no_ruas,
                nama_ruas,
                nama_jembatan,
                no_jembatan,
                panjang,
                lebar,
                kecamatan_name,
              },
              index,
            ) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{no_ruas}</TableCell>
                <TableCell>{nama_ruas}</TableCell>
                <TableCell className="truncate">{nama_jembatan}</TableCell>
                <TableCell className="truncate">{no_jembatan}</TableCell>
                <TableCell className="truncate">{panjang}</TableCell>
                <TableCell className="truncate">{lebar}</TableCell>
                <TableCell>{kecamatan_name || "-"}</TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </DialogContent>
  );
};

export default DetailDataBaik;
