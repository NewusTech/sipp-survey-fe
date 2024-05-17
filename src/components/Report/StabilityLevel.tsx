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
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import Paginations from "@/components/shared/Paginations.tsx";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Loader from "@/components/shared/Loader.tsx";
import TingkatKemantapanDetail from "./TingkatKemantapanDetail";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { months } from "@/constants";

interface StabilityLevel {
  nama_ruas: string;
  id_koridor: number;
  panjang_ruas: number;
  baik: string;
  sedang: string;
  rusak_ringan: string;
  rusak_berat: string;
  mantap: number;
  tmantap: number;
  id: number;
  kecamatan: string;
}

interface RoadSections {
  id: number;
  name: string;
}
// interface Corridors {
//   id: number;
//   name: string;
// }

const StabilityLevel = () => {
  const [stabilityLevel, setStabilityLevel] = useState<StabilityLevel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByMonth, setFilterByMonth] = useState("");
  const [roadSections, setRoadSections] = useState<RoadSections[]>([]);
  const [selectedWilayah, setSelectedWilayah] = useState(""); // State untuk menyimpan nilai yang dipilih
  // const [corridors, setCorridors] = useState<Corridors[]>([]);
  // const [filterByCorridor, setFilterByCorridor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<number>(0);
  const [showCheckboxes, setShowCheckboxes] = useState<boolean>(false);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  const perPage = 10;
  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const listStabilityLevel = "laporan/tingkat_kemantapan";
  // const roadSection = "ruas_jalan/list";
  const wilayah = "kecamatan";

  const startIndex = currentPage * perPage - perPage + 1;

  useEffect(() => {
    setIsLoading(true);
    // axios
    //   .get(`${apiUrl}/${roadSection}`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((response) => {
    //     const data = response.data.data;
    //     setRoadSections(data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // axios
    //   .get(`${apiUrl}/${corridor}`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((response) => {
    //     // Setel daftar koridor ke dalam state
    //     setCorridors(response.data.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching corridors:", error);
    //     console.log(error);
    //   });

    axios
      .get(`${apiUrl}/${listStabilityLevel}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          perPage: perPage,
          search: searchTerm,
          month: filterByMonth,
          // wilayah: selectedWilayah,
          // koridor: filterByCorridor,
        },
      })
      .then((response) => {
        const data = response.data.data.data;
        setStabilityLevel(data);
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
    // selectedWilayah,
    // filterByCorridor,
  ]);

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
      stabilityLevel.forEach((bridge) => {
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
        `${apiUrl}/laporan/export_kemantapan`,
        { id_survey: checkedIds },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((response) => {
        // Tanggapi respons dari server jika diperlukan
        window.location.href = response.data.file_url;
        toast(response.data.message);
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

  return (
    <>
      <div className="flex justify-between my-4 md:flex-row flex-col gap-3">
        <div className="flex flex-col md:flex-row  gap-4">
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
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead>Nama Ruas</TableHead>
            <TableHead>Kecamatan</TableHead>
            <TableHead className="truncate">Panjang Ruas</TableHead>
            <TableHead>Baik</TableHead>
            <TableHead>Sedang</TableHead>
            <TableHead className="truncate">Rusak Ringan</TableHead>
            <TableHead className="truncate">Rusak Berat</TableHead>
            <TableHead className="truncate">Mantap (%)</TableHead>
            <TableHead className="truncate">Tidak Mantap (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || !stabilityLevel ? (
            <TableRow>
              <TableCell colSpan={10}>
                <div className="flex justify-center items-center p-4 w-full h-full">
                  <Loader />
                </div>
              </TableCell>
            </TableRow>
          ) : stabilityLevel.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-slate-400">
                Data tidak tersedia
              </TableCell>
            </TableRow>
          ) : (
            stabilityLevel.map(
              (
                {
                  nama_ruas,
                  panjang_ruas,
                  baik,
                  sedang,
                  rusak_ringan,
                  rusak_berat,
                  mantap,
                  tmantap,
                  id,
                  kecamatan,
                },
                index
              ) => (
                <TableRow key={index}>
                  {showCheckboxes && (
                    <TableCell className="font-medium">
                      <input
                        type="checkbox"
                        checked={checkedIds.includes(id)}
                        onChange={() => handleCheckboxChange(id)}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">
                    {startIndex + index}
                  </TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <TableCell
                        className="truncate text-blue-500 underline cursor-pointer"
                        onClick={() => handleOpenModal(id)}
                      >
                        {nama_ruas}
                      </TableCell>
                    </DialogTrigger>
                    <TingkatKemantapanDetail id={selectedId} />
                  </Dialog>
                  <TableCell>{kecamatan || "-"}</TableCell>
                  <TableCell>{panjang_ruas}</TableCell>
                  <TableCell>{baik}</TableCell>
                  <TableCell>{sedang}</TableCell>
                  <TableCell>{rusak_ringan}</TableCell>
                  <TableCell>{rusak_berat}</TableCell>
                  <TableCell>{mantap}</TableCell>
                  <TableCell>{tmantap}</TableCell>
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
    </>
  );
};

export default StabilityLevel;
