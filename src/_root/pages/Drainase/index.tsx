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
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Paginations from "@/components/shared/Paginations.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

interface Drainase {
  id: number;
  no: number;
  nama_ruas: string;
  panjang_ruas: string;
  nama_desa: string;
  nama_kecamatan: string;
}
interface RoadSections {
  id: number;
  name: string;
}

interface Villages {
  id: number;
  nama: string;
}

const Drainase = () => {
  const [drainase, setDrainase] = useState<Drainase[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof Drainase>("nama_ruas");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedWilayah, setSelectedWilayah] = useState(""); // State untuk menyimpan nilai yang dipilih
  const [selectedDesa, setSelectedDesa] = useState(""); // State untuk menyimpan nilai yang dipilih
  const [roadSections, setRoadSections] = useState<RoadSections[]>([]);
  const [roadDesa, setRoadDesa] = useState<Villages[]>([]);
  const [searchInput, setSearchInput] = useState(""); // State for search input

  const filteredOptions = roadDesa.filter((drainase) =>
    drainase.nama.toLowerCase().includes(searchInput.toLowerCase()),
  );

  const perPage = 10;
  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const listDrainase = "drainase";
  const wilayah = "kecamatan";
  const desa = "master_desa";

  useEffect(() => {
    document.title = "Drainase - SIPPP";

    setIsLoading(true);
    const pageString = searchParams.get("page");
    const page = pageString ? parseInt(pageString) : 1;
    setCurrentPage(page);
    fetchRoadSections(currentPage);
  }, [searchParams, searchTerm, selectedWilayah, selectedDesa]); //currentPage

  const fetchRoadSections = (page: number) => {
    axios
      .get(`${apiUrl}/${listDrainase}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          perPage: perPage,
          // year: year,
          search: searchTerm,
          kecamatan_id: selectedWilayah,
          desa_id: selectedDesa,
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

    axios
      .get(`${apiUrl}/${desa}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setRoadDesa(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const drainaseData: Drainase[] = drainase.map((item, index) => ({
    ...item,
    no: index + 1,
  }));

  const handleSort = (field: keyof Drainase) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    sortData(field, newSortOrder, drainase);
  };

  const sortData = (
    field: keyof Drainase,
    order: "asc" | "desc",
    data: Drainase[],
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
    setDrainase(sortedData);
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
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">
            <div className="flex gap-5 md:flex-row flex-col">
              <div className="bg-white flex items-center md:justify-between px-3 gap-2 rounded-full">
                <Input
                  type="text"
                  className="border-none rounded-full w-32"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="text-gray-400" />
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
              <div className="flex md:items-center items-start gap-3 md:flex-row flex-col">
                <h4 className="text-gray-400 ml-3 md:ml-0">Desa: </h4>
                {/*<select*/}
                {/*  className="w-full md:w-[140px] rounded-full p-2 bg-white"*/}
                {/*  value={selectedDesa}*/}
                {/*  onChange={(e) => setSelectedDesa(e.target.value)}*/}
                {/*>*/}
                {/*  <option disabled>Pilih Desa</option>*/}

                {/*  {filteredOptions.map((roadSection) => (*/}
                {/*    <option key={roadSection.id} value={roadSection.id}>*/}
                {/*      {roadSection.nama}*/}
                {/*    </option>*/}
                {/*  ))}*/}
                {/*</select>*/}
                <Select
                  value={selectedDesa}
                  onValueChange={(e: string) => setSelectedDesa(e)}
                >
                  <SelectTrigger
                    name="ruas_drainase"
                    className="md:w-[180px] w-[150px] rounded-full "
                  >
                    <SelectValue placeholder="Desa" />
                  </SelectTrigger>
                  <SelectContent className="pt-10">
                    <div className="px-2 fixed border-b top-0 flex items-center justify-between z-10">
                      <Search className="text-slate-400" />
                      <Input
                        placeholder="Search..."
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)}
                      />
                    </div>
                    {filteredOptions.map((drainase) => (
                      <SelectItem
                        key={drainase.id}
                        value={drainase.id.toString()}
                      >
                        <div className="py-1 w-full">
                          <h2>{drainase.nama}</h2>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Link to="/drainase/create" className="text-white">
              <div className="flex justify-center bg-biru hover:bg-biru-2 px-5 py-2 md:py-1 items-center gap-3 rounded-full mt-2">
                Add New
                <Plus className="text-white" />
              </div>
            </Link>
          </div>
        </div>
        <Table className="bg-white rounded-2xl">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]" onClick={() => handleSort("no")}>
                No {sortField === "no" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("nama_ruas")}>
                Nama Ruas{" "}
                {sortField === "nama_ruas" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("nama_kecamatan")}>
                Kecamatan{" "}
                {sortField === "nama_kecamatan" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("nama_desa")}>
                Desa{" "}
                {sortField === "nama_desa" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("panjang_ruas")}>
                Panjang{" "}
                {sortField === "panjang_ruas" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || !drainaseData ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex justify-center items-center p-4 w-full h-full">
                    <Loader />
                  </div>
                </TableCell>
              </TableRow>
            ) : drainaseData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-400">
                  Data tidak tersedia
                </TableCell>
              </TableRow>
            ) : (
              drainaseData.map(
                ({
                  id,
                  no,
                  nama_ruas,
                  panjang_ruas,
                  nama_desa,
                  nama_kecamatan,
                }) => (
                  <TableRow key={id}>
                    <TableCell className="font-medium">{no}</TableCell>
                    <TableCell className="truncate">{nama_ruas}</TableCell>
                    <TableCell>{nama_kecamatan}</TableCell>
                    <TableCell>{nama_desa}</TableCell>
                    <TableCell>{panjang_ruas}</TableCell>
                    <TableCell className="flex gap-2">
                      <div className="rounded-full bg-abu-2 hover:bg-gray-200 h-8 w-8 flex items-center justify-center">
                        <Link to={`/drainase/edit/${id}?page=${currentPage}`}>
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
