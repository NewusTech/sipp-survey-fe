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
import Paginations from "@/components/shared/Paginations.tsx";
import Eye from "@/assets/icons/Eye.tsx";
import Loader from "@/components/shared/Loader.tsx";

interface DrainaseSurvey {
  id: number;
  total_panjang_ruas: string;
  nama_desa: string;
  nama_kecamatan: string;
}

const DrainaseData = ({ year }: { year: string }) => {
  const [drainaseList, setDrainaseList] = useState<DrainaseSurvey[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const perPage = 10;
  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const listDrainase = "survey_drainase";

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${apiUrl}/${listDrainase}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          perPage: perPage,
          // search: searchTerm,
          // month: filterByMonth,
          // koridor: filterByCorridor,
          year: year,
        },
      })
      .then((response) => {
        const data = response.data.data.data;
        setDrainaseList(data);
        setTotalPages(Math.ceil(response.data.data.total / perPage));
      })
      .catch((error) => {
        console.error("Error fetching road sections:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Table className="bg-white rounded-2xl mt-5">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead className="truncate">Nama Desa</TableHead>
            <TableHead className="truncate">Nama Kecamatan</TableHead>
            <TableHead className="truncate">Panjang Ruas</TableHead>
            <TableHead className="truncate"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || !drainaseList ? (
            <TableRow>
              <TableCell colSpan={14}>
                <div className="flex justify-center items-center p-4 w-full h-full">
                  <Loader />
                </div>
              </TableCell>
            </TableRow>
          ) : drainaseList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={14} className="text-center text-slate-400">
                Data tidak tersedia
              </TableCell>
            </TableRow>
          ) : (
            drainaseList.map(
              (
                { id, total_panjang_ruas, nama_kecamatan, nama_desa },
                index,
              ) => (
                <TableRow className="mt-10" key={id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="truncate cursor-pointer text-blue-500 underline">
                    <Link
                      to={`/survey-drainase/detail/${id}`}
                      className="cursor-pointer "
                    >
                      {nama_desa}
                    </Link>
                  </TableCell>
                  <TableCell className="truncate">
                    {nama_kecamatan || "-"}
                  </TableCell>
                  <TableCell>{total_panjang_ruas || "-"}</TableCell>
                  <TableCell>
                    <Link
                      to={`/survey-drainase/detail/${id}`}
                      className="cursor-pointer rounded-full bg-abu-2 hover:bg-gray-200 h-8 w-8 flex items-center justify-center"
                    >
                      <div>
                        <Eye />
                      </div>
                    </Link>
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

export default DrainaseData;
