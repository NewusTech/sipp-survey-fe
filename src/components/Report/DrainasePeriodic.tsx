import { Input } from "@/components/ui/input.tsx";
import { Plus, Search } from "lucide-react";
import Date from "@/assets/icons/Date.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import Paginations from "@/components/shared/Paginations.tsx";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { months } from "@/constants";
import { Link } from "react-router-dom";
import Loader from "@/components/shared/Loader.tsx";
import Eye from "@/assets/icons/Eye.tsx";

interface DrainaseSurvey {
  id: number;
  total_panjang_ruas: string;
  nama_desa: string;
  nama_kecamatan: string;
}

const DrainasePeriodic = () => {
  const [drainaseList, setDrainaseList] = useState<DrainaseSurvey[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByMonth, setFilterByMonth] = useState("");
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
          search: searchTerm,
          month: filterByMonth,
          // koridor: filterByCorridor,
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
  }, [
    currentPage,
    searchTerm,
    filterByMonth,
    // filterByCorridor,
  ]);

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
      <section className="flex justify-between my-4 md:flex-row flex-col gap-3 md:gap-0">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="bg-white flex items-center justify-between px-3 gap-2 rounded-full">
            <Input
              type="text"
              className="border-none rounded-full w-32"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="text-gray-400" />
          </div>
          <div className="flex bg-white rounded-full gap-2 pl-4 items-center pr-3">
            <Date />
            <select
              className="w-full md:w-[140px] rounded-full p-2 bg-white"
              value={filterByMonth}
              onChange={(e) => setFilterByMonth(e.target.value)}
            >
              <option disabled>Pilih Bulan</option>
              {months.map((month) => (
                <option key={month.id} value={month.id}>
                  {month.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex md:flex-row flex-col gap-2">
          <Link
            to="/survey-drainase/image"
            className="flex bg-biru hover:bg-biru-2 justify-center px-5 py-2 md:py-1 md:my-0 items-center gap-3 rounded-full"
          >
            <p className="text-white">Add Photo</p>
            <Plus className="text-white w-5" />
          </Link>
        </div>
      </section>
      <Table className="bg-white rounded-2xl">
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

export default DrainasePeriodic;
