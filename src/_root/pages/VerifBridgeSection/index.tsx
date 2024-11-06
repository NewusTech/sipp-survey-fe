import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Paginations from "@/components/shared/Paginations.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import Date from "@/assets/icons/Date.tsx";
import { months } from "@/constants";
import Eye from "@/assets/icons/Eye.tsx";
import BridgeSectionDetail from "@/components/shared/BridgeSectionDetail.tsx";
import { Textarea } from "@/components/ui/textarea";
import Verif from "@/assets/icons/Verif";
import Reject from "@/assets/icons/Reject";

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

interface RoadSections {
  id: number;
  name: string;
}

const BridgeSurveyVerification = () => {
  const [bridges, setBridges] = useState<BridgeSection[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filterByMonth, setFilterByMonth] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<number>(0);
  const [roadSections, setRoadSections] = useState<RoadSections[]>([]);
  const [selectedWilayah, setSelectedWilayah] = useState(""); // State untuk menyimpan nilai yang dipilih
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof BridgeSection>("no_ruas");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [alasan, setAlasan] = useState('');

  const perPage = 10;
  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const listBridgeSection = "jembatan";
  const wilayah = "kecamatan";

  useEffect(() => {
    document.title = "Verifikasi - SIPPP";

    setIsLoading(true);
    const pageString = searchParams.get("page");
    const page = pageString ? parseInt(pageString) : 1;
    setCurrentPage(page);
    fetchRoadSections(page);
  }, [searchParams, searchTerm, filterByMonth, selectedWilayah]);

  const fetchRoadSections = (page: number) => {
    axios
      .get(`${apiUrl}/${listBridgeSection}`, {
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
        setBridges(data);
        console.log(data);
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
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    sortData(field, newSortOrder, bridges);
  };

  const sortData = (
    field: keyof BridgeSection,
    order: "asc" | "desc",
    data: BridgeSection[],
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
    setBridges(sortedData);
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

  const handleOpenModal = (id: number) => {
    setSelectedId(id);
  };

  const onDelete = (id: number) => {
    axios
      .delete(`${apiUrl}/${listBridgeSection}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setBridges((prevBrideSections) =>
          prevBrideSections.filter((section) => section.id !== id),
        );
        toast("Berhasil delete data");
      })
      .catch((error) => {
        toast(error.message);
      });
  };

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

  return (
    <section className="bg-abu-2 w-screen md:h-[1000px] h-screen overflow-scroll md:overflow-hidden">
      <div className="sm:ml-64 py-4 flex flex-col gap-3 px-5">
        <div className="flex flex-col justify-between">
          <h1 className="text-2xl text-gray-400 ">Verifikasi Jembatan</h1>
          <div className="flex my-8 md:flex-row flex-col gap-7 justify-between items-center -mx-2 md:-mx-0">
            <div className="flex flex-col md:flex-row gap-5 w-full">
              <div className="bg-white flex items-center justify-between px-3 gap-2 rounded-full h-10">
                <Input
                  type="text"
                  className="border-none rounded-full w-32"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="text-gray-400" />
              </div>
              <div className="flex bg-white rounded-full gap-2 pl-4 items-center pr-3 h-10">
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
              <div className="flex md:items-center items-start gap-3 md:flex-row flex-col">
                <h4 className="text-gray-400 ml-3 md:ml-0">Kecamatan: </h4>
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
          </div>
        </div>

        <Table className="bg-white rounded-2xl">
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[100px] truncate"
                onClick={() => handleSort("no_ruas")}
              >
                No{" "}
                {sortField === "no_ruas" && (sortOrder === "asc" ? "↑" : "↓")}
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
                onClick={() => handleSort("no_jembatan")}
              >
                No Jembatan{" "}
                {sortField === "no_jembatan" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("asal")}>
                Asal {sortField === "asal" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="truncate"
                onClick={() => handleSort("nama_jembatan")}
              >
                Nama Jembatan{" "}
                {sortField === "nama_jembatan" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="truncate"
                onClick={() => handleSort("kmpost")}
              >
                KMPOST (km){" "}
                {sortField === "kmpost" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="truncate"
                onClick={() => handleSort("panjang")}
              >
                Panjang{" "}
                {sortField === "panjang" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="truncate"
                onClick={() => handleSort("lebar")}
              >
                Lebar{" "}
                {sortField === "lebar" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="truncate"
                onClick={() => handleSort("nilai_kondisi")}
              >
                Nilai Kondisi{" "}
                {sortField === "nilai_kondisi" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="truncate"
                onClick={() => handleSort("kondisi")}
              >
                Kondisi{" "}
                {sortField === "kondisi" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
              >
                Status
              </TableHead>
              <TableHead
              >
                Aksi
              </TableHead>
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
                  Data tidak tersedia
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

export default BridgeSurveyVerification;
