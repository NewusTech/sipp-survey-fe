import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pencil from "@/assets/icons/Pencil.tsx";
import Trash from "@/assets/icons/Trash.tsx";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Paginations from "@/components/shared/Paginations.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import Loader from "@/components/shared/Loader.tsx";

interface RoadSection {
  id: number;
  no_ruas: number;
  nama: string;
  lebar: string;
  kecamatan: string;
  panjang_ruas: number;
}

const RoadSection = () => {
  const [roadSections, setRoadSections] = useState<RoadSection[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof RoadSection>("no_ruas");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const perPage = 10;
  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const listRoadSection = "ruas_jalan/master_ruas_jalan";

  useEffect(() => {
    document.title = "Ruas Jalan - SIPPP";

    setIsLoading(true);
    const pageString = searchParams.get("page");
    const page = pageString ? parseInt(pageString) : 1;
    setCurrentPage(page);
    fetchRoadSections(page);
  }, [searchParams]);

  const fetchRoadSections = (page: number) => {
    axios
      .get(`${apiUrl}/${listRoadSection}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          perPage: perPage,
        },
      })
      .then((response) => {
        const data = response.data.data.data;
        setRoadSections(data);
        console.log(data)
        setTotalPages(Math.ceil(response.data.data.total / perPage));
      })
      .catch((error) => {
        console.error("Error fetching road sections:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSort = (field: keyof RoadSection) => {
    const newSortOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    sortData(field, newSortOrder, roadSections);
  };

  const sortData = (field: keyof RoadSection, order: "asc" | "desc", data: RoadSection[]) => {
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
    setRoadSections(sortedData);
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

  const onDelete = (id: number) => {
    axios
      .delete(`${apiUrl}/${listRoadSection}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setRoadSections((prevRoadSections) =>
          prevRoadSections.filter((section) => section.id !== id),
        );
        toast("Berhasil delete data");
      })
      .catch((error) => {
        toast(error.message);
      });
  };

  return (
    <section className="bg-abu-2 w-screen md:h-[1000px] h-screen overflow-scroll md:overflow-hidden">
      <div className="p-4 sm:ml-64 flex flex-col gap-5">
        <div className="md:flex-row flex-col md:justify-between ">
          <h1 className="text-2xl text-gray-400">Ruas Jalan</h1>
          <Link to="/road-section/create" className="text-white">
            <div className="flex justify-center bg-biru hover:bg-biru-2 px-5 py-2 md:py-1 items-center gap-3 rounded-full mt-7">
              Add New
              <Plus className="text-white" />
            </div>
          </Link>
        </div>
        <Table className="bg-white rounded-2xl">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]" onClick={() => handleSort("no_ruas")}>
                No {sortField === "no_ruas" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("nama")}>
                Nama {sortField === "nama" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("kecamatan")}>
                Kecamatan {sortField === "kecamatan" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("panjang_ruas")}>
                Panjang {sortField === "panjang_ruas" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("lebar")}>
                Lebar {sortField === "lebar" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || !roadSections ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex justify-center items-center p-4 w-full h-full">
                    <Loader />
                  </div>
                </TableCell>
              </TableRow>
            ) : roadSections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-400">
                  Data tidak tersedia
                </TableCell>
              </TableRow>
            ) : (
              roadSections.map(
                ({ id, no_ruas, nama, kecamatan, panjang_ruas, lebar }) => (
                  <TableRow key={id}>
                    <TableCell className="font-medium">{no_ruas}</TableCell>
                    <TableCell className="truncate">{nama}</TableCell>
                    <TableCell>{kecamatan || "-"}</TableCell>
                    <TableCell>{panjang_ruas}</TableCell>
                    <TableCell>{lebar}</TableCell>
                    <TableCell className="flex gap-2">
                      <div className="rounded-full bg-abu-2 hover:bg-gray-200 h-8 w-8 flex items-center justify-center">
                        <Link to={`/road-section/edit/${id}?page=${currentPage}`}>
                          <Pencil />
                        </Link>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="rounded-full bg-abu-2 hover:bg-gray-200 h-8 w-8 flex items-center justify-center">
                            <div>
                              <Trash />
                            </div>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Apakah kamu yakin ingin menghapus data ini?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Ini akan menghapus data yang sudah ada
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Tidak</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-biru hover:bg-biru-2"
                              onClick={() => onDelete(id)}
                            >
                              Ya
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
      </div>
    </section>
  );
};

export default RoadSection;
