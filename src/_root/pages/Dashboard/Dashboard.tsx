import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import RoadSectionDashboard from "@/_root/pages/Dashboard/RoadSection.tsx";
import { useEffect } from "react";
import { toast } from "sonner";
import BridgeDashboard from "@/_root/pages/Dashboard/Bridge.tsx";
import DrainaseDashboard from "@/_root/pages/Dashboard/Drainase.tsx";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard - SIPPP";

    const loginSuccessToast = localStorage.getItem("loginSuccessToast");
    if (loginSuccessToast) {
      toast(loginSuccessToast);

      localStorage.removeItem("loginSuccessToast");
    }
  }, []);
  return (
    <section className="sm:ml-64 flex md:flex-row flex-col gap-10 md:h-[1570px] w-screen overflow-scroll md:overflow-hidden">
      <div className="w-full mt-2">
        <Tabs defaultValue="jalan" className="w-full">
          <TabsList className="bg-white w-full flex flex-between">
            <TabsTrigger
              value="jalan"
              className="text-xs md:text-lg text-gray-400"
            >
              Ruas Jalan
            </TabsTrigger>
            <TabsTrigger
              value="jembatan"
              className="text-xs md:text-lg text-gray-400"
            >
              Ruas Jembatan
            </TabsTrigger>
            <TabsTrigger
              value="drainase"
              className="text-xs md:text-lg text-gray-400"
            >
              Ruas Drainase
            </TabsTrigger>
          </TabsList>
          <TabsContent value="jalan">
            <RoadSectionDashboard />
          </TabsContent>
          <TabsContent value="jembatan">
            <BridgeDashboard />
          </TabsContent>
          <TabsContent value="drainase">
            <DrainaseDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Dashboard;
