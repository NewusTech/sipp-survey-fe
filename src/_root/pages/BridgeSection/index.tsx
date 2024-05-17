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
import { FileText, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Paginations from "@/components/shared/Paginations.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { Link } from "react-router-dom";
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
import ImportBridgeSection from "@/components/BridgeSection/ImportBridgeSection.tsx";
import { Input } from "@/components/ui/input.tsx";
import Date from "@/assets/icons/Date.tsx";
import { months } from "@/constants";
import Eye from "@/assets/icons/Eye.tsx";
import BridgeSectionDetail from "@/components/shared/BridgeSectionDetail.tsx";
// import Eye from "@/assets/icons/Eye.tsx";
// import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
// import BridgeDetail from "@/components/BridgeSection/BridgeDetail.tsx";

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

const BridgeSurvey = () => {
  const [bridges, setBridges] = useState<BridgeSection[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filterByMonth, setFilterByMonth] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<number>(0);
  const [roadSections, setRoadSections] = useState<RoadSections[]>([]);
  const [selectedWilayah, setSelectedWilayah] = useState(""); // State untuk menyimpan nilai yang dipilih

  const perPage = 10;
  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const listBridgeSection = "jembatan";
  const wilayah = "kecamatan";

  useEffect(() => {
    document.title = "Ruas Jembatan - SIPPP";

    setIsLoading(true);

    fetchRoadSections(currentPage);
  }, [currentPage, searchTerm, filterByMonth]);

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
          wilayah: selectedWilayah,
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

  const onDelete = (id: number) => {
    axios
      .delete(`${apiUrl}/${listBridgeSection}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setBridges((prevBrideSections) =>
          prevBrideSections.filter((section) => section.id !== id)
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
          <h1 className="text-2xl text-gray-400 ">Survey Jembatan</h1>
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
                    <option key={roadSection.id} value={roadSection.name}>
                      {roadSection.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer flex justify-center bg-biru hover:bg-biru-2 px-5 py-2 md:py-1 items-center gap-3 rounded-full h-10">
                    <div className="text-white">Import</div>
                    <FileText className="text-white w-5" />
                  </div>
                </DialogTrigger>
                <ImportBridgeSection />
              </Dialog>
              <Link to="/bridge-survey/create" className="text-white">
                <div className="flex justify-center bg-biru hover:bg-biru-2 px-5 py-2 md:py-1 items-center gap-3 rounded-full h-10">
                  Add New
                  <Plus className="text-white w-5" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <Table className="bg-white rounded-2xl">
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
                  index
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
                )
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

export default BridgeSurvey;
