import { Input } from "@/components/ui/input.tsx";
import { FileText, Plus, Search } from "lucide-react";
import Date from "@/assets/icons/Date.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import Pencil from "@/assets/icons/Pencil.tsx";
import Trash from "@/assets/icons/Trash.tsx";
import Paginations from "@/components/shared/Paginations.tsx";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";
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
import { months } from "@/constants";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Loader from "@/components/shared/Loader.tsx";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import ImportRoadSection from "@/components/Survey/RuasJalan/ImportRoadSection.tsx";
import Eye from "@/assets/icons/Eye.tsx";
import RoadSectionDetail from "@/components/shared/RoadSectionDetail.tsx";

interface TypeOfPavement {
  hotmix: number;
  id_koridor: number;
  lapen: number;
  lebar: number;
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
}

interface RoadSections {
  id: number;
  name: string;
}

const TypeOfPavement = () => {
  const [typeOfPavement, setTypeOfPavement] = useState<TypeOfPavement[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByMonth, setFilterByMonth] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof TypeOfPavement>("no_ruas");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [roadSections, setRoadSections] = useState<RoadSections[]>([]);
  const [selectedWilayah, setSelectedWilayah] = useState(""); // State untuk menyimpan nilai yang dipilih

  const [selectedId, setSelectedId] = useState<number>(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const perPage = 10;
  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const listTypeOfPavement = "survey/jenis_perkerasan";
  const wilayah = "kecamatan";

  useEffect(() => {
    setIsLoading(true);
    const pageString = searchParams.get("page");
    const page = pageString ? parseInt(pageString) : 1;
    setCurrentPage(page);
    axios
      .get(`${apiUrl}/${listTypeOfPavement}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          perPage: perPage,
          search: searchTerm,
          month: filterByMonth,
          kecamatan_id: selectedWilayah,
        },
      })
      .then((response) => {
        const data = response.data.data.data;
        setTypeOfPavement(data);
        setTotalPages(Math.ceil(response.data.data.total / perPage));
      })
      .catch((error) => {
        console.error("Error fetching road sections:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchTerm, filterByMonth, selectedWilayah, searchParams]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/${wilayah}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setRoadSections(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSort = (field: keyof TypeOfPavement) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    sortData(field, newSortOrder, typeOfPavement);
  };

  const sortData = (
    field: keyof TypeOfPavement,
    order: "asc" | "desc",
    data: TypeOfPavement[],
  ) => {
    const sortedData = [...data].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      // Convert to number if the field is expected to be numeric but is in string format
      const numA =
        typeof valueA === "string" && !isNaN(Number(valueA))
          ? Number(valueA)
          : valueA;
      const numB =
        typeof valueB === "string" && !isNaN(Number(valueB))
          ? Number(valueB)
          : valueB;

      if (typeof numA === "number" && typeof numB === "number") {
        return order === "asc" ? numA - numB : numB - numA;
      } else if (typeof valueA === "string" && typeof valueB === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        // Handle case where the field values are of mixed types or other types
        return 0;
      }
    });
    setTypeOfPavement(sortedData);
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
      .delete(`${apiUrl}/${listTypeOfPavement}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setTypeOfPavement((prevRoadSections) =>
          prevRoadSections.filter((section) => section.id !== id),
        );
        toast("Berhasil delete data");
      })
      .catch((error) => {
        toast(error.message);
      });
  };

  const handleOpenModal = (id: number) => {
    setSelectedId(id);
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
          <div className="flex md:items-center items-start gap-2 md:flex-row flex-col">
            <h4 className="text-gray-400">Kecamatan : </h4>
            <select
              className="w-full md:w-[140px] rounded-full p-2 bg-white"
              value={selectedWilayah}
              onChange={(e) => setSelectedWilayah(e.target.value)}
            >
              <option disabled>Pilih Wilayah</option>
              {roadSections.map((roadSection) => (
                <option key={roadSection.id} value={roadSection.id}>
                  {roadSection.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <div className="cursor-pointer flex bg-biru hover:bg-biru-2 justify-center px-5 py-2 md:py-1 my-3 md:my-0 items-center gap-3 rounded-full">
                <div className="text-white">Import</div>
                <FileText className="text-white w-5" />
              </div>
            </DialogTrigger>
            <ImportRoadSection />
          </Dialog>
          <Link
            to="/road-survey/create"
            className="flex bg-biru hover:bg-biru-2 justify-center px-5 py-2 md:py-1 md:my-0 items-center gap-3 rounded-full"
          >
            <p className="text-white">Add New</p>
            <Plus className="text-white w-5" />
          </Link>
        </div>
      </section>
      <Table className="bg-white rounded-2xl">
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-[100px] truncate"
              onClick={() => handleSort("no_ruas")}
            >
              No {sortField === "no_ruas" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="truncate"
              onClick={() => handleSort("nama_ruas")}
            >
              Nama Ruas{" "}
              {sortField === "nama_ruas" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="truncate"
              onClick={() => handleSort("name_kecamatan")}
            >
              Kecamatan{" "}
              {sortField === "name_kecamatan" &&
                (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="truncate"
              onClick={() => handleSort("panjang_ruas")}
            >
              Panjang Ruas{" "}
              {sortField === "panjang_ruas" &&
                (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="truncate" onClick={() => handleSort("lebar")}>
              Lebar Ruas{" "}
              {sortField === "lebar" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead >
              Status
            </TableHead>
            <TableHead >
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || !typeOfPavement ? (
            <TableRow>
              <TableCell colSpan={14}>
                <div className="flex justify-center items-center p-4 w-full h-full">
                  <Loader />
                </div>
              </TableCell>
            </TableRow>
          ) : typeOfPavement.length === 0 ? (
            <TableRow>
              <TableCell colSpan={14} className="text-center text-slate-400">
                Data tidak tersedia
              </TableCell>
            </TableRow>
          ) : (
            typeOfPavement.map(
              ({
                nama_ruas,
                panjang_ruas,
                lebar,
                no_ruas,
                id,
                name_kecamatan,
              }) => (
                <TableRow className="mt-10" key={id}>
                  <TableCell className="font-medium">{no_ruas}</TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <TableCell
                        className="truncate cursor-pointer text-blue-500 underline"
                        onClick={() => handleOpenModal(id)}
                      >
                        {nama_ruas}
                      </TableCell>
                    </DialogTrigger>
                    <RoadSectionDetail id={selectedId} />
                  </Dialog>
                  <TableCell className="truncate">
                    {name_kecamatan || "-"}
                  </TableCell>
                  <TableCell>{panjang_ruas}</TableCell>
                  <TableCell>{lebar || "-"}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="rounded-full bg-abu-2 hover:bg-gray-200 h-8 w-8 flex items-center justify-center">
                          <p className="px-2 py-1 text-black rounded bg-green-200 inline-block">Diterima</p>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Detail Verifikasi
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <div className="wrap flex gap-2 text-black">
                              <div className="Status w-[100px] flex-shrink-0">Status</div>
                              <div className="Status">:</div>
                              <div className="text-green-700">Diterima</div>
                            </div>
                            <div className="wrap flex gap-2 text-black mt-2">
                              <div className="Status w-[100px] flex-shrink-0">Keterangan</div>
                              <div className="Status">:</div>
                              <div className="">Data sudah sesuai</div>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="w-[100px]">Keluar</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center justify-center">
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
                        <RoadSectionDetail id={selectedId} />
                      </Dialog>
                      <Link
                        to={`/road-survey/edit/${id}?page=${currentPage}`}
                        className="cursor-pointer rounded-full bg-abu-2 hover:bg-gray-200 h-8 w-8 flex items-center justify-center"
                      >
                        <div>
                          <Pencil />
                        </div>
                      </Link>
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

export default TypeOfPavement;
