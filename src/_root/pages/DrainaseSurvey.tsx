import { useEffect } from "react";
import DrainaseSurvey from "@/components/Survey/Drainase";

const RoadSurvey = () => {
  useEffect(() => {
    document.title = "Drainase Survey - SIPPP";
  }, []);
  return (
    <section className="bg-abu-2 w-screen md:h-[1050px] overflow-scroll md:overflow-hidden">
      <div className="sm:ml-64 flex flex-col gap-5 p-5">
        <h1 className="text-2xl text-gray-400">Survey Drainase</h1>
        <DrainaseSurvey />
      </div>
    </section>
  );
};

export default RoadSurvey;
