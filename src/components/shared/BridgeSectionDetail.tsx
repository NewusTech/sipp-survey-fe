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

interface BridgeSection {
  id: number;
  no_ruas: string;
  nama_ruas: string;
  no_jembatan: string;
  asal: string;
  nama_jembatan: string;
  kmpost: string;
  panjang: string;
  lebar: string;
  jml_bentang: string;
  tipe_ba: string;
  kondisi_ba: string;
  tipe_bb: string;
  kondisi_bb: string;
  tipe_fondasi: string;
  kondisi_fondasi: string;
  bahan: string;
  kondisi_lantai: string;
  nilai_kondisi: number;
  kondisi: string;
  kecamatan_name: string;
  latitude: string;
  longitude: string;
}

const BridgeSectionDetail = ({ id }: { id: number }) => {
  const [bridgeSectionData, setBridgeSectionData] =
    useState<BridgeSection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const detail = "jembatan";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    if (id) {
      axios
        .get(`${apiUrl}/${detail}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setBridgeSectionData(response.data.data);
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
        `${apiUrl}/jembatan/export_byrow`,
        { id_jembatan: [id] },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        // Tanggapi respons dari server jika diperlukan
        window.location.href = response.data.file_url;
        toast(response.data.message);
        console.log(response.data.file_url);
      })
      .catch((error) => {
        // Tangani kesalahan jika permintaan gagal
        console.error(error);
      });
  };

  return (
    <DialogContent className="w-full flex flex-col h-full md:h-[750px] overflow-scroll">
      <DialogHeader>
        <DialogTitle>Detail Ruas Jembatan</DialogTitle>
      </DialogHeader>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        bridgeSectionData && (
          <>
            <div className="flex border-b p-2">
              <div className="flex flex-col justify-between w-full">
                <div className="font-bold">{bridgeSectionData.no_ruas}</div>
                <div>{bridgeSectionData.nama_ruas}</div>
                <div>{bridgeSectionData.nama_jembatan}</div>
                <div>{bridgeSectionData.kecamatan_name || "-"}</div>
                <div>{bridgeSectionData.asal}</div>
              </div>
            </div>
            <div className="flex gap-10 border-b p-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">No</div>
                <div>{bridgeSectionData.no_jembatan}</div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Panjang</div>
                <div>{bridgeSectionData.panjang}</div>
              </div>
            </div>
            <div className="flex gap-10 border-b p-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Lebar</div>
                <div>{bridgeSectionData.lebar}</div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">KMPOST (km)</div>
                <div>{bridgeSectionData.kmpost}</div>
              </div>
            </div>
            <div className="flex gap-10 border-b p-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Jumlah bentang</div>
                <div>{bridgeSectionData.jml_bentang}</div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Tipe BA</div>
                <div>{bridgeSectionData.tipe_ba}</div>
              </div>
            </div>
            <div className="flex gap-10 border-b p-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Kondisi BA</div>
                <div>{bridgeSectionData.kondisi_ba}</div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Tipe BB</div>
                <div>{bridgeSectionData.kondisi_bb}</div>
              </div>
            </div>
            <div className="flex gap-10 border-b p-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Tipe Fondasi</div>
                <div>{bridgeSectionData.tipe_fondasi}</div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Kondisi Fondasi</div>
                <div>{bridgeSectionData.kondisi_fondasi}</div>
              </div>
            </div>
            <div className="flex gap-10 border-b p-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Bahan</div>
                <div>{bridgeSectionData.bahan}</div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Kondisi</div>
                <div>{bridgeSectionData.kondisi}</div>
              </div>
            </div>
            <div className="flex gap-10 border-b p-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">Nilai Kondisi</div>
                <div>{bridgeSectionData.nilai_kondisi}</div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">G. Bujur</div>
                <div>{bridgeSectionData.latitude || "-"}</div>
              </div>
            </div>
            <div className="flex gap-10 border-b p-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="font-bold">G. Lintang</div>
                <div>{bridgeSectionData.longitude || "-"}</div>
              </div>
              <div className="flex justify-between items-center w-0 md:w-full"></div>
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-biru hover:bg-biru-2"
                onClick={handleDowload}
              >
                Download Ruas Jembatan
              </Button>
            </div>
          </>
        )
      )}
    </DialogContent>
  );
};

export default BridgeSectionDetail;
