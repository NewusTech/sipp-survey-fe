import Paginations from "@/components/shared/Paginations.tsx";
import AddNew from "@/components/Corridor/AddNew.tsx";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface Corridor {
  id: number;
  name: string;
}

const Corridor = () => {
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;
  const token = Cookies.get("adsxcl");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const listCorrdior = "koridor/master_koridor";

  useEffect(() => {
    document.title = "Koridor - SIPPP";

    axios
      .get(`${apiUrl}/${listCorrdior}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          perPage: perPage,
        },
      })
      .then((response) => {
        const data = response.data.data.data;
        setCorridors(data);
        setTotalPages(Math.ceil(response.data.data.total / perPage));
      })
      .catch((error) => {
        console.error("Error fetching corridors:", error);
      });
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const fetchCorridors = () => {
    axios
      .get(`${apiUrl}/${listCorrdior}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          perPage: perPage,
        },
      })
      .then((response) => {
        const data = response.data.data.data;
        setCorridors(data);
        setTotalPages(Math.ceil(response.data.data.total / perPage));
      })
      .catch((error) => {
        console.error("Error fetching corridors:", error);
      });
  };

  return (
    <section className="bg-abu-2 w-screen h-screen overflow-scroll md:overflow-hidden">
      <div className="p-4 sm:ml-64 flex gap-10">
        <div className="container mx-auto md:px-20 px-0 md:flex-row flex-col mt-10 md:mt-[50px] flex gap-6">
          <div className="w-full md:w-full">
            <h1 className="text-gray-400 text-2xl">Koridor</h1>
            <div className="w-full md:w-full bg-white h-[375px] md:h-[393px] rounded-2xl mt-2 py-5">
              <div className="flex items-center flex-wrap justify-center gap-3 md:gap-5">
                {corridors.map((corridor) => (
                  <div
                    key={corridor.id}
                    className="px-10 md:px-14 py-4 rounded-full bg-abu-2 shadow-md"
                  >
                    <p>{corridor.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <Paginations
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
              onPageChange={handlePageChange}
            />
          </div>
          <AddNew refreshCorridors={fetchCorridors} />
        </div>
      </div>
    </section>
  );
};

export default Corridor;
