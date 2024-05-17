import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import RoadSectionData from "@/components/Dashboard/RoadSectionData.tsx";
import BridgeSectionData from "@/components/Dashboard/BridgeSectionData.tsx";

const TableData = ({ year }: { year: string }) => {
  return (
    <>
      <div className="w-full py-4">
        <div className="p-4 bg-white mt-5 mb-2 rounded-xl">
          <Tabs defaultValue="road-section" className="w-full">
            <TabsList>
              <TabsTrigger value="road-section">Survey Ruas Jalan</TabsTrigger>
              <TabsTrigger value="bridge-section">
                Survey Ruas Jembatan
              </TabsTrigger>
            </TabsList>
            <TabsContent value="road-section">
              <RoadSectionData year={year} />
            </TabsContent>
            <TabsContent value="bridge-section">
              <BridgeSectionData year={year} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default TableData;
