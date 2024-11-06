import TypeOfPavementVerifikasi from "@/components/Verifikasi/RuasJalan/TypeOfPavement";
import { useEffect } from "react";

const RoadSectionVerification = () => {
  useEffect(() => {
    document.title = "Verifikasi - SIPPP";
  }, []);
  return (
    <section className="bg-abu-2 w-screen md:h-[1050px] overflow-scroll md:overflow-hidden">
      <div className="sm:ml-64 flex flex-col gap-5 p-5">
        <h1 className="text-2xl text-gray-400">Verifikasi Jalan</h1>
        <TypeOfPavementVerifikasi />
      </div>
    </section>
  );
};

export default RoadSectionVerification;
