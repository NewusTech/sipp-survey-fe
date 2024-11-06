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
import {
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { Search } from "lucide-react";
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
import { toast } from "sonner";
import { months } from "@/constants";
import { Input } from "@/components/ui/input.tsx";
import Date from "@/assets/icons/Date.tsx";
import Verif from "@/assets/icons/Verif";
import Reject from "@/assets/icons/Reject";
import { Textarea } from "@/components/ui/textarea";

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

const DrainaseDetailVerif = () => {
    const { id } = useParams();
    const [drainase, setDrainase] = useState<Drainase[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterByMonth, setFilterByMonth] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [sortField, setSortField] = useState<keyof Drainase>("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [alasan, setAlasan] = useState('');


    const token = Cookies.get("adsxcl");
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    const perPage = 10;

    const handlePreviousPage = () => {
        navigate(`?page=${currentPage - 1}`);
    };

    const handleNextPage = () => {
        navigate(`?page=${currentPage + 1}`);
    };

    const handlePageChange = (page: number) => {
        navigate(`?page=${page}`);
    };

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

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            const pageString = searchParams.get("page");
            const page = pageString ? parseInt(pageString) : 1;
            setCurrentPage(page);
            axios
                .get(`${apiUrl}/survey_drainase/detail`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        desa_id: id,
                        page: page,
                        month: filterByMonth,
                        perPage: perPage,
                        search: searchTerm,
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
    }, [id, searchParams, searchTerm, filterByMonth]);

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


    return (
        <section className="sm:ml-64 px-10 bg-abu-2 w-screen md:h-[1050px] overflow-scroll md:overflow-hidden">
            <div className="flex justify-between my-4 md:flex-row flex-col gap-3 md:gap-0">
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
            </div>
            <Table className="bg-white rounded-2xl">
                <TableHeader>
                    <TableRow>
                        <TableHead
                            className="w-[100px] truncate"
                            onClick={() => handleSort("id")}
                        >
                            No {sortField === "id" && (sortOrder === "asc" ? "↑" : "↓")}
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
                            onClick={() => handleSort("nama_desa")}
                        >
                            Desa{" "}
                            {sortField === "nama_desa" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead
                            className="truncate"
                            onClick={() => handleSort("nama_kecamatan")}
                        >
                            Kecamatan{" "}
                            {sortField === "nama_kecamatan" &&
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
                        <TableHead
                            className="truncate"
                            onClick={() => handleSort("panjang_drainase")}
                        >
                            Panjang Drainase{" "}
                            {sortField === "panjang_drainase" &&
                                (sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead
                            className="truncate"
                            onClick={() => handleSort("letak_drainase")}
                        >
                            Letak Drainase{" "}
                            {sortField === "letak_drainase" &&
                                (sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead
                            className="truncate"
                            onClick={() => handleSort("lebar_atas")}
                        >
                            Lebar Atas{" "}
                            {sortField === "lebar_atas" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead
                            className="truncate"
                            onClick={() => handleSort("lebar_bawah")}
                        >
                            Lebar Bawah{" "}
                            {sortField === "lebar_bawah" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead
                            className="truncate"
                            onClick={() => handleSort("tinggi")}
                        >
                            Tinggi{" "}
                            {sortField === "tinggi" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead
                            className="truncate"
                            onClick={() => handleSort("kondisi")}
                        >
                            Kondisi{" "}
                            {sortField === "kondisi" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
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
                        drainase.map((item) => (
                            <TableRow className="mt-10" key={item.id}>
                                <TableCell className="font-medium">{item.id}</TableCell>
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
                                                        onClick={() => onDelete(item.id)}
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
                                                        onClick={() => onDelete(item.id)}
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

export default DrainaseDetailVerif;
