import { Input } from "@/components/ui/input.tsx";
import { Plus, Search } from "lucide-react";
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
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import Loader from "@/components/shared/Loader.tsx";
import Eye from "@/assets/icons/Eye.tsx";

interface DrainaseSurvey {
  id: number;
  total_panjang_ruas: string;
  nama_desa: string;
  nama_kecamatan: string;
}

const DrainaseSurvey = () => {
  const [drainaseList, setDrainaseList] = useState<DrainaseSurvey[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof DrainaseSurvey>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const perPage = 10;
  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const listDrainase = "survey_drainase";

  useEffect(() => {
    setIsLoading(true);
    const pageString = searchParams.get("page");
    const page = pageString ? parseInt(pageString) : 1;
    setCurrentPage(page);
    axios
      .get(`${apiUrl}/${listDrainase}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          perPage: perPage,
          search: searchTerm,
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
    searchParams,
    searchTerm,
  ]);

  const handleSort = (field: keyof DrainaseSurvey) => {
    const newSortOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    sortData(field, newSortOrder, drainaseList);
  };

  const sortData = (field: keyof DrainaseSurvey, order: "asc" | "desc", data: DrainaseSurvey[]) => {
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
    setDrainaseList(sortedData);
  };

  const handlePreviousPage = () => {
    navigate(`?page=${currentPage - 1}`);
  };

  const handleNextPage = () => {
    navigate(`?page=${currentPage + 1}`);
  };

  const handlePageChange = (page: number) => {
    navigate(`?page=${page}`);
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
            <TableHead className="w-[100px] truncate" onClick={() => handleSort("id")}>
              No {sortField === "id" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="truncate" onClick={() => handleSort("nama_desa")}>
              Desa {sortField === "nama_desa" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="truncate" onClick={() => handleSort("nama_kecamatan")}>
              Kecamatan {sortField === "nama_kecamatan" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="truncate" onClick={() => handleSort("total_panjang_ruas")}>
              Panjang Ruas {sortField === "total_panjang_ruas" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
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
                { id, total_panjang_ruas, nama_kecamatan, nama_desa }
              ) => (
                <TableRow className="mt-10" key={id}>
                  <TableCell className="font-medium">{id}</TableCell>
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

export default DrainaseSurvey;
