import TypeOfPavement from "@/components/Survey/RuasJalan/TypeOfPavement.tsx";
import { useEffect } from "react";

const RoadSurvey = () => {
  useEffect(() => {
    document.title = "RoadSurvey - SIPPP";
  }, []);
  return (
    <section className="bg-abu-2 w-screen md:h-[1050px] overflow-scroll md:overflow-hidden">
      <div className="sm:ml-64 flex flex-col gap-5 p-5">
        <h1 className="text-2xl text-gray-400">Survey Jalan</h1>
        <TypeOfPavement />
      </div>
    </section>
  );
};

export default RoadSurvey;
