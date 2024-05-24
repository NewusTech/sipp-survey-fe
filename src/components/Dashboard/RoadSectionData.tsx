import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import Eye from "@/assets/icons/Eye.tsx";
import { Link } from "react-router-dom";
import Pencil from "@/assets/icons/Pencil.tsx";
import Paginations from "@/components/shared/Paginations.tsx";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import RoadSectionDetail from "@/components/shared/RoadSectionDetail.tsx";
import Loader from "@/components/shared/Loader.tsx";

interface RoadData {
  hotmix: number;
  id_koridor: number;
  lapen: number;
  lebar: number;
  name_kecamatan: string;
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
}

const RoadSectionData = ({ year }: { year: string }) => {
  const [roadSection, setRoadSection] = useState<RoadData[]>([]);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof RoadData>("no_ruas");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const perPage = 10;
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const roadSectionList = "survey/jenis_perkerasan";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${apiUrl}/${roadSectionList}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          perPage: perPage,
          year: year,
        },
      })
      .then((response) => {
        const data = response.data.data.data;
        setRoadSection(data);
        setTotalPages(Math.ceil(response.data.data.total / perPage));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage, year]);

  const handleSort = (field: keyof RoadData) => {
    const newSortOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    sortData(field, newSortOrder, roadSection);
  };

  const sortData = (field: keyof RoadData, order: "asc" | "desc", data: RoadData[]) => {
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
    setRoadSection(sortedData);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
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
            <TableHead className="truncate" onClick={() => handleSort("name_kecamatan")}>
              Kecamatan {sortField === "name_kecamatan" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="truncate" onClick={() => handleSort("panjang_ruas")}>
              Panjang Ruas {sortField === "panjang_ruas" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="truncate" onClick={() => handleSort("lebar")}>
              Lebar Ruas {sortField === "lebar" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || !roadSection ? (
            <TableRow>
              <TableCell colSpan={11}>
                <div className="flex justify-center items-center p-4 w-full h-full">
                  <Loader />
                </div>
              </TableCell>
            </TableRow>
          ) : roadSection.length === 0 ? (
            <TableRow>
              <TableCell colSpan={15} className="text-center text-slate-400">
                Data tidak tersedia pada tahun {year}
              </TableCell>
            </TableRow>
          ) : (
            roadSection.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.no_ruas}</TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <TableCell
                      className="truncate cursor-pointer text-blue-500 underline"
                      onClick={() => handleOpenModal(item.id)}
                    >
                      {item.nama_ruas}
                    </TableCell>
                  </DialogTrigger>
                  <RoadSectionDetail id={selectedId} />
                </Dialog>
                <TableCell>{item.name_kecamatan || "-"}</TableCell>
                <TableCell>{item.panjang_ruas}</TableCell>
                <TableCell>{item.lebar || "-"}</TableCell>
                <TableCell className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div
                        onClick={() => handleOpenModal(item.id)}
                        className="cursor-pointer rounded-full bg-abu-2 hover:bg-gray-200 h-8 w-8 flex items-center justify-center"
                      >
                        <div>
                          <Eye />
                        </div>
                      </div>
                    </DialogTrigger>
                    <RoadSectionDetail id={selectedId} />
                  </Dialog>
                  <div className="rounded-full bg-abu-2 hover:bg-gray-200 h-8 w-8 flex items-center justify-center">
                    <Link to={`/road-survey/edit/${item.id}`}>
                      <Pencil />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
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

export default RoadSectionData;
