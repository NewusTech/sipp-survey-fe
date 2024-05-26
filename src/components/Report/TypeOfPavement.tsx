import { Input } from "@/components/ui/input.tsx";
import { Search } from "lucide-react";
import Date from "@/assets/icons/Date.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import Paginations from "@/components/shared/Paginations.tsx";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { months } from "@/constants";
import Loader from "@/components/shared/Loader.tsx";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import RoadSectionDetail from "@/components/shared/RoadSectionDetail.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";

interface TypeOfPavement {
  hotmix: number;
  id_koridor: number;
  lapen: number;
  lebar: number;
  name_kecamatan: string;
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
  mantap: number;
  tmantap: number;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByMonth, setFilterByMonth] = useState("");
  const [roadSections, setRoadSections] = useState<RoadSections[]>([]);
  const [selectedWilayah, setSelectedWilayah] = useState(""); // State untuk menyimpan nilai yang dipilih
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [showCheckboxes, setShowCheckboxes] = useState<boolean>(false);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [sortField, setSortField] = useState<keyof TypeOfPavement>("no_ruas");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const perPage = 10;
  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const listTypeOfPavement = "survey/jenis_perkerasan";
  // const roadSection = "ruas_jalan/list";
  const wilayah = "kecamatan";

  // const startIndex = currentPage * perPage - perPage + 1;

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleOpenModal = (id: number) => {
    setSelectedId(id);
  };

  const handleOpenCheckbox = () => {
    setShowCheckboxes(!showCheckboxes);
  };

  const handleHeaderCheckboxChange = () => {
    setIsCheckedAll(!isCheckedAll);
    const newCheckedIds: number[] = [];
    if (!isCheckedAll) {
      typeOfPavement.forEach((bridge) => {
        newCheckedIds.push(bridge.id);
      });
    }
    setCheckedIds(newCheckedIds);
  };

  const handleCheckboxChange = (id: number) => {
    const index = checkedIds.indexOf(id);
    if (index === -1) {
      setCheckedIds([...checkedIds, id]);
    } else {
      const newCheckedIds = [...checkedIds];
      newCheckedIds.splice(index, 1);
      setCheckedIds(newCheckedIds);
    }
  };

  const handleDownloadSelected = () => {
    axios
      .post(
        `${apiUrl}/survey/export_byrow`,
        { id_survey: checkedIds },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((response) => {
        // Tanggapi respons dari server jika diperlukan
        window.location.href = response.data.file_url;
        toast(response.data.message);
        console.log(response);
      })
      .catch((error) => {
        // Tangani kesalahan jika permintaan gagal
        console.error(error);
      });
    console.log(checkedIds);
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

  console.log(typeOfPavement);

  return (
    <>
      <div className="flex justify-between my-4 md:flex-row flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="bg-white flex items-center justify-between px-3 gap-2 rounded-full">
            <Input
              type="text"
              className="border-none rounded-full w-32 bg-white"
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
                <option key={roadSection.id} value={roadSection.name}>
                  {roadSection.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          {showCheckboxes && (
            <Button
              className="rounded-full bg-biru"
              onClick={handleDownloadSelected}
            >
              Download
            </Button>
          )}
          <Button onClick={handleOpenCheckbox} className="rounded-full bg-biru">
            Pilih Ruas Jembatan
          </Button>
        </div>
      </div>
      <Table className="bg-white rounded-2xl">
        <TableHeader>
          <TableRow>
            {showCheckboxes && (
              <TableHead className="w-[100px]">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isCheckedAll}
                    onChange={handleHeaderCheckboxChange}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    All
                  </label>
                </div>
              </TableHead>
            )}
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
              Panjang{" "}
              {sortField === "panjang_ruas" &&
                (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="truncate" onClick={() => handleSort("lebar")}>
              Lebar {sortField === "lebar" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="truncate" onClick={() => handleSort("rigit")}>
              Rigit {sortField === "rigit" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="truncate"
              onClick={() => handleSort("hotmix")}
            >
              Hotmix{" "}
              {sortField === "hotmix" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="truncate" onClick={() => handleSort("lapen")}>
              Lapen {sortField === "lapen" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="truncate"
              onClick={() => handleSort("telford")}
            >
              Telford{" "}
              {sortField === "telford" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="truncate" onClick={() => handleSort("tanah")}>
              Tanah {sortField === "tanah" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="truncate" onClick={() => handleSort("baik")}>
              Baik {sortField === "baik" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="truncate"
              onClick={() => handleSort("sedang")}
            >
              Sedang{" "}
              {sortField === "sedang" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="truncate"
              onClick={() => handleSort("rusak_ringan")}
            >
              Rusak Ringan{" "}
              {sortField === "rusak_ringan" &&
                (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="truncate"
              onClick={() => handleSort("rusak_berat")}
            >
              Rusak Berat{" "}
              {sortField === "rusak_berat" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="truncate"
              onClick={() => handleSort("rusak_berat")}
            >
              Mantap %
              {sortField === "rusak_berat" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="truncate"
              onClick={() => handleSort("rusak_berat")}
            >
              Tidak Mantap %
              {sortField === "rusak_berat" && (sortOrder === "asc" ? "↑" : "↓")}
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
                hotmix,
                name_kecamatan,
                lapen,
                nama_ruas,
                telford,
                panjang_ruas,
                lebar,
                rigit,
                tanah,
                no_ruas,
                id,
                baik,
                sedang,
                rusak_ringan,
                rusak_berat,
                mantap,
                tmantap,
              }) => (
                <TableRow className="mt-10" key={id}>
                  {showCheckboxes && (
                    <TableCell className="font-medium">
                      <input
                        type="checkbox"
                        checked={checkedIds.includes(id)}
                        onChange={() => handleCheckboxChange(id)}
                      />
                    </TableCell>
                  )}
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
                  <TableCell className="truncate">{name_kecamatan}</TableCell>
                  <TableCell>{panjang_ruas}</TableCell>
                  <TableCell>{lebar || "-"}</TableCell>
                  <TableCell>{rigit || "-"}</TableCell>
                  <TableCell>{hotmix || "-"}</TableCell>
                  <TableCell>{lapen || "-"}</TableCell>
                  <TableCell>{telford || "-"}</TableCell>
                  <TableCell>{tanah || "-"}</TableCell>
                  <TableCell>{baik || "-"}</TableCell>
                  <TableCell>{sedang || "-"}</TableCell>
                  <TableCell>{rusak_ringan || "-"}</TableCell>
                  <TableCell>{rusak_berat || "-"}</TableCell>
                  <TableCell>{mantap || "-"}</TableCell>
                  <TableCell>{tmantap || "-"}</TableCell>
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
