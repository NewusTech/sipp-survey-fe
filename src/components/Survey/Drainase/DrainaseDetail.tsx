// import { Button } from "@/components/ui/button.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "@/components/shared/Loader.tsx";
import { Link, useParams } from "react-router-dom";
// import { Input } from "@/components/ui/input.tsx";
import { FileText, Plus } from "lucide-react";
// import Date from "@/assets/icons/Date.tsx";
// import { months } from "@/constants";
import Paginations from "@/components/shared/Paginations.tsx";
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
import { Button } from "@/components/ui/button.tsx";
import Trash from "@/assets/icons/Trash.tsx";
// import Eye from "@/assets/icons/Eye.tsx";
// import RoadSectionDetail from "@/components/shared/RoadSectionDetail.tsx";
import Pencil from "@/assets/icons/Pencil.tsx";
import { toast } from "sonner";

interface Drainase {
  id: number;
  nama_ruas: string;
  panjang_ruas: string;
  nama_desa: string;
  panjang_drainase: number;
  letak_drainase: string;
  lebar_atas: string;
  lebar_bawah: string;
  tinggi: string;
  kondisi: string;
  nama_kecamatan: string;
}

const DrainaseDetail = () => {
  const { id } = useParams();
  const [drainase, setDrainase] = useState<Drainase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const perPage = 10;

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios
        .get(`${apiUrl}/survey_drainase/detail`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            desa_id: id,
            page: currentPage,
            perPage: perPage,
          },
        })
        .then((response) => {
          const data = response.data.data.data;
          setDrainase(data);
          setTotalPages(Math.ceil(response.data.data.total / perPage));
        })
        .catch((error) => {
          console.error("Error fetching road sections:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  const onDelete = (id: number) => {
    axios
      .delete(`${apiUrl}/survey_drainase/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setDrainase((prevRoadSections) =>
          prevRoadSections.filter((section) => section.id !== id),
        );
        toast("Berhasil delete data");
      })
      .catch((error) => {
        toast(error.message);
      });
  };

  const exportData = () => {
    axios
      .get(`${apiUrl}/export_drainase`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          desa_id: id,
        },
      })
      .then((response) => {
        toast(response.data.message);
        window.location.href = response.data.file_url;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <section className="sm:ml-64 px-10 bg-abu-2 w-screen md:h-[1050px] overflow-scroll md:overflow-hidden">
      <div className="flex justify-between my-4 md:flex-row flex-col gap-3 md:gap-0">
        <div className="flex flex-col md:flex-row gap-5">
          {/*  <div className="bg-white flex items-center justify-between px-3 gap-2 rounded-full">*/}
          {/*    <Input*/}
          {/*      type="text"*/}
          {/*      className="border-none rounded-full w-32"*/}
          {/*      placeholder="Search"*/}
          {/*      value={searchTerm}*/}
          {/*      onChange={(e) => setSearchTerm(e.target.value)}*/}
          {/*    />*/}
          {/*    <Search className="text-gray-400" />*/}
          {/*  </div>*/}
          {/*  <div className="flex bg-white rounded-full gap-2 pl-4 items-center pr-3">*/}
          {/*    <Date />*/}
          {/*    <select*/}
          {/*      className="w-full md:w-[140px] rounded-full p-2 bg-white"*/}
          {/*      value={filterByMonth}*/}
          {/*      onChange={(e) => setFilterByMonth(e.target.value)}*/}
          {/*    >*/}
          {/*      <option disabled>Pilih Bulan</option>*/}
          {/*      {months.map((month) => (*/}
          {/*        <option key={month.id} value={month.id}>*/}
          {/*          {month.name}*/}
          {/*        </option>*/}
          {/*      ))}*/}
          {/*    </select>*/}
          {/*  </div>*/}
          {/*  <div className="flex md:items-center items-start gap-2 md:flex-row flex-col">*/}
          {/*    <h4 className="text-gray-400">Desa : </h4>*/}
          {/*    <select*/}
          {/*      className="w-full md:w-[140px] rounded-full p-2 bg-white"*/}
          {/*      value={selectedWilayah}*/}
          {/*      onChange={(e) => setSelectedWilayah(e.target.value)}*/}
          {/*    >*/}
          {/*      <option disabled>Pilih Wilayah</option>*/}
          {/*      {villages.map((village) => (*/}
          {/*        <option key={village.id} value={village.id}>*/}
          {/*          {village.nama}*/}
          {/*        </option>*/}
          {/*      ))}*/}
          {/*    </select>*/}
          {/*  </div>*/}
        </div>

        <div className="flex md:flex-row flex-col gap-2">
          <div
            onClick={exportData}
            className="cursor-pointer flex bg-biru hover:bg-biru-2 justify-center px-5 py-2 md:py-1 my-3 md:my-0 items-center gap-3 rounded-full"
          >
            <div className="text-white">Export</div>
            <FileText className="text-white w-5" />
          </div>

          <Link
            to="/survey-drainase/create"
            className="flex bg-biru hover:bg-biru-2 justify-center px-5 py-2 md:py-1 md:my-0 items-center gap-3 rounded-full"
          >
            <p className="text-white">Add New</p>
            <Plus className="text-white w-5" />
          </Link>
        </div>
      </div>
      <Table className="bg-white rounded-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead></TableHead>
            <TableHead className="truncate">Nama Ruas</TableHead>
            <TableHead className="truncate">Nama Desa</TableHead>
            <TableHead className="truncate">Nama Kecamatan</TableHead>
            <TableHead className="truncate">Panjang Ruas</TableHead>
            <TableHead className="truncate">Panjang Drainase</TableHead>
            <TableHead className="truncate">Letak Drainase</TableHead>
            <TableHead className="truncate">Lebar Atas</TableHead>
            <TableHead className="truncate">Lebar Bawah</TableHead>
            <TableHead className="truncate">Tinggi</TableHead>
            <TableHead className="truncate">Kondisi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || !drainase ? (
            <TableRow>
              <TableCell colSpan={12}>
                <div className="flex justify-center items-center p-4 w-full h-full">
                  <Loader />
                </div>
              </TableCell>
            </TableRow>
          ) : drainase.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} className="text-center text-slate-400">
                Data tidak tersedia
              </TableCell>
            </TableRow>
          ) : (
            drainase.map((item, index) => (
              <TableRow className="mt-10" key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell></TableCell>
                <TableCell className="truncate">{item.nama_ruas}</TableCell>
                <TableCell className="truncate">{item.nama_desa}</TableCell>
                <TableCell className="truncate">
                  {item.nama_kecamatan || "-"}
                </TableCell>
                <TableCell>{item.panjang_ruas}</TableCell>
                <TableCell>{item.panjang_drainase}</TableCell>
                <TableCell className="truncate">
                  {item.letak_drainase}
                </TableCell>
                <TableCell>{item.lebar_atas}</TableCell>
                <TableCell>{item.lebar_bawah}</TableCell>
                <TableCell>{item.tinggi}</TableCell>
                <TableCell>{item.kondisi}</TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center justify-center">
                    <Link
                      to={`/survey-drainase/edit/${item.id}`}
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
                            onClick={() => onDelete(item.id)}
                          >
                            Ya
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
    </section>
  );
};

export default DrainaseDetail;
