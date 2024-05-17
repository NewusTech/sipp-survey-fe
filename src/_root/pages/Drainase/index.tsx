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

interface Drainase {
  id: number;
  nama_ruas: string;
  panjang_ruas: string;
  nama_desa: string;
  nama_kecamatan: string;
}

const Drainase = () => {
  const [drainase, setDrainase] = useState<Drainase[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const perPage = 10;
  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const listDrainase = "drainase";

  useEffect(() => {
    document.title = "Drainase - SIPPP";

    setIsLoading(true);

    fetchRoadSections(currentPage);
  }, []); //currentPage

  const fetchRoadSections = (page: number) => {
    axios
      .get(`${apiUrl}/${listDrainase}`, {
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
        setDrainase(data);
        setTotalPages(Math.ceil(response.data.data.total / perPage));
      })
      .catch((error) => {
        console.error("Error fetching road sections:", error);
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

  const onDelete = (id: number) => {
    axios
      .delete(`${apiUrl}/${listDrainase}/${id}`, {
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

  return (
    <section className="bg-abu-2 w-screen md:h-[1000px] h-screen overflow-scroll md:overflow-hidden">
      <div className="p-4 sm:ml-64 flex flex-col gap-5">
        <div className="md:flex-row flex-col md:justify-between ">
          <h1 className="text-2xl text-gray-400">Drainase</h1>
          <Link to="/drainase/create" className="text-white">
            <div className="flex justify-center bg-biru hover:bg-biru-2 px-5 py-2 md:py-1 items-center gap-3 rounded-full mt-7">
              Add New
              <Plus className="text-white" />
            </div>
          </Link>
        </div>
        <Table className="bg-white rounded-2xl">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>Nama Ruas</TableHead>
              <TableHead>Kecamatan</TableHead>
              <TableHead>Desa</TableHead>
              <TableHead>Panjang</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || !drainase ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex justify-center items-center p-4 w-full h-full">
                    <Loader />
                  </div>
                </TableCell>
              </TableRow>
            ) : drainase.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-400">
                  Data tidak tersedia
                </TableCell>
              </TableRow>
            ) : (
              drainase.map(
                (
                  { id, nama_ruas, panjang_ruas, nama_desa, nama_kecamatan },
                  index,
                ) => (
                  <TableRow key={id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="truncate">{nama_ruas}</TableCell>
                    <TableCell>{nama_kecamatan}</TableCell>
                    <TableCell>{nama_desa}</TableCell>
                    <TableCell>{panjang_ruas}</TableCell>
                    <TableCell className="flex gap-2">
                      <div className="rounded-full bg-abu-2 hover:bg-gray-200 h-8 w-8 flex items-center justify-center">
                        <Link to={`/drainase/edit/${id}`}>
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

export default Drainase;
