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

interface RoadData {
  agregat: number;
  hotmix: number;
  id_koridor: number;
  lapen: number;
  lebar: string;
  nama_koridor: string;
  nama_ruas: string;
  telford: number;
  panjang_ruas: number;
  rigit: number;
  ruas_jalan_id: number;
  tanah: number;
  no_ruas: string;
  baik: number;
  sedang: number;
  rusak_ringan: number;
  rusak_berat: number;
  id: number;
  name_kecamatan: string;
  akses: string;
  lhr: string;
  keterangan: string;
}

const RoadSectionDetail = ({ id }: { id: number }) => {
  const [roadSectionData, setRoadSectionData] = useState<RoadData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const detail = "survey/jenis_perkerasan";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    if (id) {
      axios
        .get(`${apiUrl}/${detail}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setRoadSectionData(response.data.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleDowload = () => {
    axios
      .post(
        `${apiUrl}/survey/export_byrow`,
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
    <DialogContent className="w-full flex flex-col h-[800px] md:h-[650px]">
      <DialogHeader>
        <DialogTitle>Detail Ruas Jalan</DialogTitle>
      </DialogHeader>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        roadSectionData && (
          <>
            <div className="flex border-b p-2">
              <div className="flex flex-col justify-between w-full">
                <div className="font-bold">{roadSectionData.no_ruas}</div>
                <div>{roadSectionData.nama_ruas}</div>
                <div>{roadSectionData.name_kecamatan || "-"}</div>
              </div>
            </div>
            <div className="flex gap-10 border-b p-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Panjang Ruas</div>
                <div>{roadSectionData.panjang_ruas}</div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Lebar Ruas</div>
                <div>{roadSectionData.lebar || "-"}</div>
              </div>
            </div>
            <div className="flex gap-10 border-b p-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Rigit</div>
                <div>{roadSectionData.rigit}</div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Hotmix</div>
                <div>{roadSectionData.hotmix}</div>
              </div>
            </div>
            <div className="flex gap-10 border-b p-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Lapen</div>
                <div>{roadSectionData.lapen}</div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Telford</div>
                <div>{roadSectionData.telford}</div>
              </div>
            </div>
            <div className="flex gap-10 border-b p-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Tanah</div>
                <div>{roadSectionData.tanah}</div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Baik</div>
                <div>{roadSectionData.baik}</div>
              </div>
            </div>
            <div className="flex gap-10 border-b p-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Sedang</div>
                <div>{roadSectionData.sedang}</div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Rusak Ringan</div>
                <div>{roadSectionData.rusak_ringan}</div>
              </div>
            </div>
            <div className="flex gap-10 border-b p-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Rusak Berat</div>
                <div>{roadSectionData.rusak_berat}</div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">LHR</div>
                <div>{roadSectionData.lhr || "-"}</div>
              </div>
            </div>
            <div className="flex gap-10 border-b p-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Akses</div>
                <div>{roadSectionData.akses || "-"}</div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Keterangan</div>
                <div>{roadSectionData.keterangan || "-"}</div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-biru hover:bg-biru-2"
                onClick={handleDowload}
              >
                Download Ruas Jalan
              </Button>
            </div>
          </>
        )
      )}
    </DialogContent>
  );
};

export default RoadSectionDetail;
