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
import { Link } from "react-router-dom";
import Loader from "@/components/shared/Loader.tsx";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
// import ImportBridgeSection from "@/components/BridgeSection/ImportBridgeSection.tsx";
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

// interface Corridors {
//   id: number;
//   name: string;
// }

const TypeOfPavement = () => {
  const [typeOfPavement, setTypeOfPavement] = useState<TypeOfPavement[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByMonth, setFilterByMonth] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [roadSections, setRoadSections] = useState<RoadSections[]>([]);
  const [selectedWilayah, setSelectedWilayah] = useState(""); // State untuk menyimpan nilai yang dipilih
  // const [corridors, setCorridors] = useState<Corridors[]>([]);
  // const [filterByCorridor, setFilterByCorridor] = useState("");

  const [selectedId, setSelectedId] = useState<number>(0);

  const perPage = 10;
  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const listTypeOfPavement = "survey/jenis_perkerasan";
  const wilayah = "kecamatan";
  // const corridor = "koridor/list";

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${apiUrl}/${listTypeOfPavement}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          perPage: perPage,
          search: searchTerm,
          month: filterByMonth,
          wilayah: selectedWilayah,
          // koridor: filterByCorridor,
        },
      })
      .then((response) => {
        const data = response.data.data.data;
        setTypeOfPavement(data);
        setTotalPages(Math.ceil(response.data.data.total / perPage));
        console.log(data);
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
    selectedWilayah,
    // filterByCorridor,
  ]);

  // useEffect(() => {
  //   axios
  //     .get(`${apiUrl}/${corridor}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       // Setel daftar koridor ke dalam state
  //       setCorridors(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching corridors:", error);
  //       console.log(error);
  //     });
  // }, []);

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

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
              <option key={roadSection.id} value={roadSection.name}>
                {roadSection.name}
              </option>
            ))}
          </select>
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
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead className="truncate">Nama Ruas</TableHead>
            <TableHead className="truncate">Kecamatan</TableHead>
            <TableHead className="truncate">Panjang Ruas</TableHead>
            <TableHead className="truncate">Lebar Ruas</TableHead>
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
                        to={`/road-survey/edit/${id}`}
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
