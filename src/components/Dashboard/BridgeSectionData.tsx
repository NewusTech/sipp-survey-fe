import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Link } from "react-router-dom";
import Pencil from "@/assets/icons/Pencil.tsx";
import Paginations from "@/components/shared/Paginations.tsx";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import Eye from "@/assets/icons/Eye.tsx";
import BridgeSectionDetail from "@/components/shared/BridgeSectionDetail.tsx";
import Loader from "@/components/shared/Loader.tsx";

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
}

const BridgeSectionData = ({ year }: { year: string }) => {
  const [bridges, setBridges] = useState<BridgeSection[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const perPage = 10;
  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const listBridgeSection = "jembatan";

  useEffect(() => {
    document.title = "Ruas Jembatan - SIPPP";

    setIsLoading(true);

    fetchRoadSections(currentPage);
  }, [currentPage]);

  const fetchRoadSections = (page: number) => {
    axios
      .get(`${apiUrl}/${listBridgeSection}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          perPage: perPage,
          year: year,
        },
      })
      .then((response) => {
        const data = response.data.data.data;
        setBridges(data);
        console.log(response);
        setTotalPages(Math.ceil(response.data.data.total / perPage));
      })
      .catch((error) => {
        console.error("Error fetching bridge sections:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (id: number) => {
    setSelectedId(id);
  };

  return (
    <>
      <Table className="bg-white rounded-2xl mt-5">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead className="truncate">Nama Ruas</TableHead>
            <TableHead className="truncate">No Jembatan</TableHead>
            <TableHead>Asal</TableHead>
            <TableHead className="truncate">Nama Jembatan</TableHead>
            <TableHead className="truncate">KMPOST (Km)</TableHead>
            <TableHead>Panjang</TableHead>
            <TableHead>Lebar</TableHead>
            <TableHead className="truncate">Nilai Kondisi</TableHead>
            <TableHead>Kondisi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || !bridges ? (
            <TableRow>
              <TableCell colSpan={11}>
                <div className="flex justify-center items-center p-4 w-full h-full">
                  <Loader />
                </div>
              </TableCell>
            </TableRow>
          ) : bridges.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center text-slate-400">
                Data tidak tersedia pada tahun {year}
              </TableCell>
            </TableRow>
          ) : (
            bridges.map(
              (
                {
                  id,
                  no_ruas,
                  nama_ruas,
                  no_jembatan,
                  asal,
                  nama_jembatan,
                  kmpost,
                  panjang,
                  lebar,
                  nilai_kondisi,
                  kondisi,
                },
                index,
              ) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{no_ruas}</TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <TableCell
                        className="truncate text-blue-500 underline cursor-pointer"
                        onClick={() => handleOpenModal(id)}
                      >
                        {nama_ruas}
                      </TableCell>
                    </DialogTrigger>
                    <BridgeSectionDetail id={selectedId} />
                  </Dialog>
                  <TableCell>{no_jembatan}</TableCell>
                  <TableCell className="truncate">{asal}</TableCell>
                  <TableCell className="truncate">{nama_jembatan}</TableCell>
                  <TableCell>{kmpost}</TableCell>
                  <TableCell>{panjang}</TableCell>
                  <TableCell>{lebar}</TableCell>
                  <TableCell>{nilai_kondisi}</TableCell>
                  <TableCell>{kondisi}</TableCell>
                  <TableCell className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div
                          onClick={() => handleOpenModal(id)}
                          className="cursor-pointer rounded-full bg-abu-2 hover:bg-gray-200 h-8 w-8 flex items-center justify-center"
                        >
                          <div>
                            <Eye />
                          </div>
                        </div>
                      </DialogTrigger>
                      <BridgeSectionDetail id={selectedId} />
                    </Dialog>
                    <div className="rounded-full bg-abu-2 hover:bg-gray-200 h-8 w-8 flex items-center justify-center">
                      <Link to={`/bridge-survey/edit/${id}`}>
                        <Pencil />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ),
            )
          )}
        </TableBody>
      </Table>
      <Paginations
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default BridgeSectionData;
