import { Input } from "@/components/ui/input.tsx";
import { Search } from "lucide-react";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "@/components/shared/Loader.tsx";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import Eye from "@/assets/icons/Eye.tsx";
import RoadSectionDetail from "@/components/shared/RoadSectionDetail.tsx";
import { Textarea } from "@/components/ui/textarea";
import Reject from "@/assets/icons/Reject";
import Verif from "@/assets/icons/Verif";

interface TypeOfPavementVerifikasi {
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

const TypeOfPavementVerifikasi = () => {
  const [typeOfPavementVerifikasi, setTypeOfPavementVerifikasi] = useState<TypeOfPavementVerifikasi[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByMonth, setFilterByMonth] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof TypeOfPavementVerifikasi>("no_ruas");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [roadSections, setRoadSections] = useState<RoadSections[]>([]);
  const [selectedWilayah, setSelectedWilayah] = useState(""); // State untuk menyimpan nilai yang dipilih
  const [alasan, setAlasan] = useState('');

  const [selectedId, setSelectedId] = useState<number>(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const perPage = 10;
  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const listTypeOfPavementVerifikasi = "survey/jenis_perkerasan";
  const wilayah = "kecamatan";

  useEffect(() => {
    setIsLoading(true);
    const pageString = searchParams.get("page");
    const page = pageString ? parseInt(pageString) : 1;
    setCurrentPage(page);
    axios
      .get(`${apiUrl}/${listTypeOfPavementVerifikasi}`, {
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
        setTypeOfPavementVerifikasi(data);
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

  const handleSort = (field: keyof TypeOfPavementVerifikasi) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    sortData(field, newSortOrder, typeOfPavementVerifikasi);
  };

  const sortData = (
    field: keyof TypeOfPavementVerifikasi,
    order: "asc" | "desc",
    data: TypeOfPavementVerifikasi[],
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
    setTypeOfPavementVerifikasi(sortedData);
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
      .delete(`${apiUrl}/${listTypeOfPavementVerifikasi}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setTypeOfPavementVerifikasi((prevRoadSections) =>
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
          {isLoading || !typeOfPavementVerifikasi ? (
            <TableRow>
              <TableCell colSpan={14}>
                <div className="flex justify-center items-center p-4 w-full h-full">
                  <Loader />
                </div>
              </TableCell>
            </TableRow>
          ) : typeOfPavementVerifikasi.length === 0 ? (
            <TableRow>
              <TableCell colSpan={14} className="text-center text-slate-400">
                Data tidak tersedia
              </TableCell>
            </TableRow>
          ) : (
            typeOfPavementVerifikasi.map(
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
                      {/* verif */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="rounded-full bg-abu-2 hover:bg-gray-200 h-8 w-8 flex items-center justify-center">
                            <div>
                              <Verif />
                            </div>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Apakah kamu yakin ingin menerima data ini?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Dengan menerima, data yang ada akan diperbarui.
                              <Textarea
                                className='placeholder:text-[#3D3D3DB2]/70 placeholder:text-sm h-[150px] mt-2 p-3 text-xs md:text-base'
                                placeholder="Silahkan masukan keterangan"
                                value={alasan}
                                onChange={(e) => setAlasan(e.target.value)}
                              />
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="w-[100px]">Tidak</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-biru hover:bg-biru-2 w-[100px]"
                              onClick={() => onDelete(id)}
                              disabled={!alasan} // Disable button if loading or no reason provided
                            >
                              Ya
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      {/* reject */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="rounded-full bg-abu-2 hover:bg-gray-200 h-8 w-8 flex items-center justify-center">
                            <div>
                              <Reject />
                            </div>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Apakah kamu yakin ingin menolak data ini?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Dengan menolak, data yang ada akan diperbarui.
                              <Textarea
                                className='placeholder:text-[#3D3D3DB2]/70 placeholder:text-sm h-[150px] mt-2 p-3 text-xs md:text-base'
                                placeholder="Silahkan masukan keterangan"
                                value={alasan}
                                onChange={(e) => setAlasan(e.target.value)}
                              />
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="w-[100px]">Tidak</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-biru hover:bg-biru-2 w-[100px]"
                              onClick={() => onDelete(id)}
                              disabled={!alasan} // Disable button if loading or no reason provided
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

export default TypeOfPavementVerifikasi;
