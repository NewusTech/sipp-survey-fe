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
  const [sortField, setSortField] = useState<keyof BridgeSection>("no_ruas");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const perPage = 10;
  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const listBridgeSection = "jembatan";

  useEffect(() => {
    document.title = "Ruas Jembatan - SIPPP";

    setIsLoading(true);

    fetchRoadSections(currentPage);
  }, [currentPage]);

  // console.log(year)

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


  const handleSort = (field: keyof BridgeSection) => {
    const newSortOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    sortData(field, newSortOrder, bridges);
  };

  const sortData = (field: keyof BridgeSection, order: "asc" | "desc", data: BridgeSection[]) => {
    const sortedData = [...data].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      // Convert to number if the field is expected to be numeric but is in string format
      const numA = typeof valueA === 'string' && !isNaN(Number(valueA)) ? Number(valueA) : valueA;
      const numB = typeof valueB === 'string' && !isNaN(Number(valueB)) ? Number(valueB) : valueB;

      if (typeof numA === 'number' && typeof numB === 'number') {
        return order === "asc" ? numA - numB : numB - numA;
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        // Handle case where the field values are of mixed types or other types
        return 0;
      }
    });
    setBridges(sortedData);
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
            <TableHead className="w-[100px] truncate" onClick={() => handleSort("no_ruas")}>
              No {sortField === "no_ruas" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="truncate" onClick={() => handleSort("nama_ruas")}>
              Nama Ruas {sortField === "nama_ruas" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="truncate" onClick={() => handleSort("no_jembatan")}>
              No Jembatan {sortField === "no_jembatan" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("asal")}>
              Asal {sortField === "asal" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="truncate" onClick={() => handleSort("nama_jembatan")}>
              Nama Jembatan {sortField === "nama_jembatan" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="truncate" onClick={() => handleSort("kmpost")}>
              KMPOST (km) {sortField === "kmpost" && (sortOrder === "asc" ? "↑" : "↓")}</TableHead>
            <TableHead className="truncate" onClick={() => handleSort("panjang")}>
              Panjang {sortField === "panjang" && (sortOrder === "asc" ? "↑" : "↓")}</TableHead>
            <TableHead className="truncate" onClick={() => handleSort("lebar")}>
              Lebar {sortField === "lebar" && (sortOrder === "asc" ? "↑" : "↓")}</TableHead>
            <TableHead className="truncate" onClick={() => handleSort("nilai_kondisi")}>
              Nilai Kondisi {sortField === "nilai_kondisi" && (sortOrder === "asc" ? "↑" : "↓")}</TableHead>
            <TableHead className="truncate" onClick={() => handleSort("kondisi")}>
              Kondisi {sortField === "kondisi" && (sortOrder === "asc" ? "↑" : "↓")}</TableHead>
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
