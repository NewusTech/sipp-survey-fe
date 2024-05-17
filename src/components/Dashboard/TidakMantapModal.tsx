import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import Loader from "@/components/shared/Loader.tsx";
import roadSection from "@/_root/pages/RoadSection";

interface RoadSection {
  nama: string;
  name_kecamatan: string;
  panjang_ruas: string;
  lebar: string;
  rusak_ringan: string;
  rusak_berat: string;
}

const TidakMantapModal = ({ year }: { year: string }) => {
  const [roadSectionData, setRoadSectionData] = useState<RoadSection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const detail = "dashboard/detail_tmantap";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    axios
      .get(`${apiUrl}/${detail}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          year: year,
        },
      })
      .then((response) => {
        setRoadSectionData(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [year]);

  return (
    <DialogContent className="overflow-scroll flex flex-col">
      <DialogHeader>
        <DialogTitle>
          Ruas Jalan Dengan Tingkat Kemantapan Tidak Mantap Tahun 2023
        </DialogTitle>
      </DialogHeader>
      <Table className="bg-white rounded-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] truncate">
              Nama Ruas Jalan
            </TableHead>
            <TableHead>Kecamatan</TableHead>
            <TableHead className="truncate">Panjang Ruas</TableHead>
            <TableHead className="truncate">Lebar Ruas</TableHead>
            <TableHead className="truncate">Rusak Ringan</TableHead>
            <TableHead className="truncate">Rusak Berat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || !roadSection ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex justify-center items-center p-4 w-full h-full">
                  <Loader />
                </div>
              </TableCell>
            </TableRow>
          ) : roadSectionData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-slate-400">
                Data tidak tersedia pada tahun {year}
              </TableCell>
            </TableRow>
          ) : (
            roadSectionData.map(
              (
                {
                  nama,
                  name_kecamatan,
                  panjang_ruas,
                  lebar,
                  rusak_ringan,
                  rusak_berat,
                },
                index,
              ) => (
                <TableRow key={index}>
                  <TableCell className="font-medium truncate">{nama}</TableCell>
                  <TableCell className="truncate">{name_kecamatan}</TableCell>
                  <TableCell>{panjang_ruas}</TableCell>
                  <TableCell>{lebar || "-"}</TableCell>
                  <TableCell>{rusak_ringan || "-"}</TableCell>
                  <TableCell>{rusak_berat || "-"}</TableCell>
                </TableRow>
              ),
            )
          )}
        </TableBody>
      </Table>
    </DialogContent>
  );
};

export default TidakMantapModal;
