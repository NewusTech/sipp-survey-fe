import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";

import TypeOfPavement from "@/components/Report/TypeOfPavement.tsx";
import StabilityLevel from "@/components/Report/StabilityLevel.tsx";
import { useEffect } from "react";
import BridgeSectionPeriodic from "@/components/Report/BridgeSectionPeriodic.tsx";
import DrainasePeriodic from "@/components/Report/DrainasePeriodic.tsx";

const Periodic = () => {
  useEffect(() => {
    document.title = "Laporan Periodik - SIPPP";
  }, []);

  return (
    <section className="bg-abu-2 w-screen md:h-[950px] overflow-scroll md:overflow-hidden">
      <div className="sm:ml-64 flex flex-col gap-5">
        <Tabs defaultValue="type-of-pavement" className="w-full -mb-5">
          <TabsList className="bg-white md:w-full flex flex-between border-t-8 md:py-6 shadow">
            <TabsTrigger
              value="type-of-pavement"
              className="text-xs md:text-xl text-gray-400"
            >
              Ruas Jalan
            </TabsTrigger>
            <TabsTrigger
              value="bridge-section"
              className="text-xs md:text-xl text-gray-400"
            >
              Ruas Jembatan
            </TabsTrigger>
            <TabsTrigger
              value="drainase"
              className="text-xs md:text-xl text-gray-400"
            >
              Drainase
            </TabsTrigger>
            <TabsTrigger
              value="stability-level"
              className="text-xs md:text-xl text-gray-400"
            >
              Tingkat Kemantapan
            </TabsTrigger>
          </TabsList>
          <TabsContent value="type-of-pavement" className=" mx-3">
            <TypeOfPavement />
          </TabsContent>
          <TabsContent value="bridge-section" className=" mx-3">
            <BridgeSectionPeriodic />
          </TabsContent>
          <TabsContent value="drainase" className=" mx-3">
            <DrainasePeriodic />
          </TabsContent>
          <TabsContent value="stability-level" className=" mx-3">
            <StabilityLevel />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Periodic;
