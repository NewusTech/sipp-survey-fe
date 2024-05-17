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

interface BridgeSection {
  nama: string;
  name_kecamatan: string;
  panjang_ruas: string;
  lebar: string;
  baik: string;
  sedang: string;
}

const MantapModal = ({ year }: { year: string }) => {
  const [bridgeSectionData, setBridgeSectionData] = useState<BridgeSection[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const detail = "dashboard/detail_mantap";
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
        setBridgeSectionData(response.data.data);
        setIsLoading(false);
        console.log(response.data.data);
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
          Ruas Jalan Dengan Tingkat Kemantapan Mantap Tahun 2023
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
            <TableHead>Baik</TableHead>
            <TableHead>Sedang</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || !bridgeSectionData ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex justify-center items-center p-4 w-full h-full">
                  <Loader />
                </div>
              </TableCell>
            </TableRow>
          ) : bridgeSectionData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-slate-400">
                Data tidak tersedia pada tahun {year}
              </TableCell>
            </TableRow>
          ) : (
            bridgeSectionData.map(
              (
                { nama, name_kecamatan, panjang_ruas, lebar, baik, sedang },
                index,
              ) => (
                <TableRow key={index}>
                  <TableCell className="font-medium truncate">{nama}</TableCell>
                  <TableCell className="truncate">{name_kecamatan}</TableCell>
                  <TableCell>{panjang_ruas}</TableCell>
                  <TableCell>{lebar || "-"}</TableCell>
                  <TableCell>{baik || "-"}</TableCell>
                  <TableCell>{sedang || "-"}</TableCell>
                </TableRow>
              ),
            )
          )}
        </TableBody>
      </Table>
    </DialogContent>
  );
};

export default MantapModal;
