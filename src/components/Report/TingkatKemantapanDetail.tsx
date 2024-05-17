import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";

interface TingkatKemantapan {
  id: number;
  no_ruas: number;
  nama_ruas: string;
  panjang_ruas: string;
  lebar: string;
  baik: string;
  sedang: string;
  rusak_ringan: string;
  rusak_berat: string;
  mantap: string;
  tmantap: string;
  kecamatan: string;
}

const TingkatKemantapanDetail = ({ id }: { id: number }) => {
  const [tingkatKemantapan, setTingkatKemantapan] =
    useState<TingkatKemantapan | null>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const detail = "laporan/show_kemantapan";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    if (id) {
      axios
        .get(`${apiUrl}/${detail}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setTingkatKemantapan(response.data.data);
          // setIsLoading(false);
          console.log(response.data.data);
        })
        .catch((error) => {
          console.log(error);
          // setIsLoading(false);
        });
    }
  }, [id]);

  const handleDownload = () => {
    axios
      .post(
        `${apiUrl}/laporan/export_kemantapan`,
        { id_survey: [id] },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((response) => {
        // Tanggapi respons dari server jika diperlukan
        window.location.href = response.data.file_url;
        toast(response.data.message);
      })
      .catch((error) => {
        // Tangani kesalahan jika permintaan gagal
        console.error(error);
      });
  };

  return (
    <DialogContent className="w-full flex flex-col h-[600px] md:h-[500px]">
      <DialogHeader>
        <DialogTitle>Detail Tingkat Kemantapan</DialogTitle>
      </DialogHeader>

      {tingkatKemantapan && (
        <>
          <div className="flex border-b flex-col p-2">
            <div>{tingkatKemantapan.nama_ruas || "-"}</div>
            <div>{tingkatKemantapan.kecamatan || "-"}</div>
          </div>
          <div className="flex gap-10 border-b p-2">
            <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
              <div className="font-bold">Panjang</div>
              <div>{tingkatKemantapan.panjang_ruas} KM</div>
            </div>
            <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
              <div className="font-bold">Lebar</div>
              <div>{tingkatKemantapan.lebar || "-"} KM</div>
            </div>
          </div>
          <div className="flex gap-10 border-b p-2">
            <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
              <div className="font-bold">Baik</div>
              <div>{tingkatKemantapan.baik}</div>
            </div>
            <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
              <div className="font-bold">Sedang</div>
              <div>{tingkatKemantapan.sedang}</div>
            </div>
          </div>
          <div className="flex gap-10 border-b p-2">
            <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
              <div className="font-bold">Rusak Ringan</div>
              <div>{tingkatKemantapan.rusak_ringan}</div>
            </div>
            <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
              <div className="font-bold">Rusak Berat</div>
              <div>{tingkatKemantapan.rusak_berat}</div>
            </div>
          </div>
          <div className="flex gap-10 border-b p-2">
            <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
              <div className="font-bold">Mantap (%)</div>
              <div>{tingkatKemantapan.mantap}</div>
            </div>
            <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
              <div className="font-bold">Tidak Mantap (%)</div>
              <div>{tingkatKemantapan.tmantap}</div>
            </div>
          </div>
          <div className="flex justify-end mt-10">
            <Button
              className="bg-biru hover:bg-biru-2"
              onClick={handleDownload}
            >
              Download Tingkat Kemantapan Ruas Jalan
            </Button>
          </div>
        </>
      )}
    </DialogContent>
  );
};

export default TingkatKemantapanDetail;
