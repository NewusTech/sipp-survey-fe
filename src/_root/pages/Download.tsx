import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";

const Download = () => {
  const [selectedYearRoadSection, setSelectedYearRoadSection] =
    useState<string>("");
  const [selectedYearBridgeSection, setSelectedYearBridgeSection] =
    useState<string>("");

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const exportRuasJalan = "export_survey_jalan";
  const exportRuasJembatan = "export_survey_jembatan";
  const token = Cookies.get("adsxcl");

  useEffect(() => {
    document.title = "Laporan Download - SIPPP";
  }, []);
  // 1. Define your form.

  const handleYearChangeRoadSection = (value: string) => {
    // Mengambil nilai yang dipilih dari dropdown
    const selectedValue = value;
    // Menetapkan nilai yang dipilih ke dalam state
    setSelectedYearRoadSection(selectedValue);
  };

  const handleYearChangeBridgeSection = (value: string) => {
    // Mengambil nilai yang dipilih dari dropdown
    const selectedValue = value;
    // Menetapkan nilai yang dipilih ke dalam state
    setSelectedYearBridgeSection(selectedValue);
  };

  const handleExportRoadSectionClick = () => {
    axios
      .get(`${apiUrl}/${exportRuasJalan}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          year: selectedYearRoadSection,
        },
      })
      .then((response) => {
        if (response.data.success) {
          window.location.href = response.data.file_url;
          toast(response.data.message);
        } else {
          toast(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleExportBridgeSectionClick = () => {
    axios
      .get(`${apiUrl}/${exportRuasJembatan}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          year: selectedYearBridgeSection,
        },
      })
      .then((response) => {
        if (response.data.success) {
          window.location.href = response.data.file_url;
          toast(response.data.message);
        } else {
          toast(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast("Failed to fetch data from server");
      });
  };

  return (
    <section className="bg-abu-2 w-screen md:h-[600px] overflow-scroll md:overflow-hidden">
      <div className="sm:ml-64 flex flex-col gap-5">
        <div className="container mx-auto mt-10">
          <h1 className="ml-6 text-gray-400 text-xl font-medium">Download</h1>
          <div className="w-full flex md:flex-row flex-col justify-around h-[550px] md:h-[400px] bg-white rounded-lg mt-6">
            <div className="flex flex-col justify-center">
              <h1 className="text-slate-400 font-medium px-5 pt-5 md:p-0">
                Export Data Ruas Jalan
              </h1>
              <div className="flex flex-col items-center justify-center py-10">
                <div className="flex flex-col">
                  <p className="font-medium mb-2">Tahun</p>
                  <Select
                    onValueChange={handleYearChangeRoadSection}
                    defaultValue="2024"
                  >
                    <SelectTrigger className="w-[250px] border-none shadow-md">
                      <SelectValue placeholder="pilih tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-center py-3 md:py-10 mt-7 md:mt-0">
                  <Button
                    onClick={handleExportRoadSectionClick}
                    type="button"
                    className="px-14 bg-biru hover:bg-biru-2 rounded-xl"
                  >
                    Export
                  </Button>
                </div>
              </div>
            </div>
            <div className="hidden md:block md:h-full md:w-1.5 bg-slate-200"></div>
            <div className="md:hidden w-full h-2 bg-slate-200 text-white">
              &nbsp;
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-slate-400 font-medium px-5 pt-5 md:p-0">
                Export Data Ruas Jembatan
              </h1>
              <div className="flex flex-col items-center justify-center py-10">
                <div className="flex flex-col">
                  <p className="font-medium mb-2">Tahun</p>
                  <Select
                    onValueChange={handleYearChangeBridgeSection}
                    defaultValue="2024"
                  >
                    <SelectTrigger className="w-[250px] border-none shadow-md">
                      <SelectValue placeholder="pilih tahun" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-center py-3 md:py-10 mt-7 md:mt-0">
                  <Button
                    onClick={handleExportBridgeSectionClick}
                    type="button"
                    className="px-14 bg-biru hover:bg-biru-2 rounded-xl"
                  >
                    Export
                  </Button>
                </div>
                {/*<div className="md:w-96 md:h-96 h-64 w-64 flex flex-col justify-center items-center gap-5">*/}
                {/*  <img*/}
                {/*    src="/assets/images/under.svg"*/}
                {/*    alt="underconstruction"*/}
                {/*    className="object-cover mt-10"*/}
                {/*  />*/}
                {/*  <p className="text-xl">Under Construction</p>*/}
                {/*</div>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Download;
