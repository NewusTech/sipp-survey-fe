import { useEffect } from "react";
import DrainaseVerifikasi from "@/components/Verifikasi/Drainase";

const DrainaseVerification = () => {
  useEffect(() => {
    document.title = "Drainase Survey - SIPPP";
  }, []);
  return (
    <section className="bg-abu-2 w-screen md:h-[1050px] overflow-scroll md:overflow-hidden">
      <div className="sm:ml-64 flex flex-col gap-5 p-5">
        <h1 className="text-2xl text-gray-400">Verifikasi Drainase</h1>
        <DrainaseVerifikasi />
      </div>
    </section>
  );
};

export default DrainaseVerification;
