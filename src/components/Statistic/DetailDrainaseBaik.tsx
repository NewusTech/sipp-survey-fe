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
  nama_ruas: string;
  panjang_ruas: string;
  nama_desa: string;
  panjang_drainase: number;
  letak_drainase: string;
  lebar_atas: string;
  lebar_bawah: string;
  tinggi: string;
  kondisi: string;
  latitude: string;
  longitude: string;
  nama_kecamatan: string;
}

const DetailDrainaseBaik = ({
  year,
  kondisi,
}: {
  year: string;
  kondisi: string;
}) => {
  const [baikData, setBaikData] = useState<BaikSection[]>([]);

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const baik = "detail_statistic_drainase";
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
          const data = response.data.data.data;
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
            <TableHead className="w-[100px] truncate">No</TableHead>
            <TableHead>Nama Ruas</TableHead>
            <TableHead className="truncate">Panjang</TableHead>
            <TableHead className="truncate">Desa</TableHead>
            <TableHead className="truncate">Kecamatan</TableHead>
            <TableHead className="truncate">Letak Drainase</TableHead>
            <TableHead>Kondisi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {baikData.map((v, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{v.nama_ruas}</TableCell>
              <TableCell className="truncate">{v.panjang_ruas}</TableCell>
              <TableCell className="truncate">{v.nama_desa}</TableCell>
              <TableCell className="truncate">{v.nama_kecamatan}</TableCell>
              <TableCell className="truncate">{v.letak_drainase}</TableCell>
              <TableCell>{v.kondisi}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DialogContent>
  );
};

export default DetailDrainaseBaik;
