import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "@/assets/icons/Dashboard.tsx";
import { Database, FileText } from "lucide-react";
import Survey from "@/assets/icons/Survey.tsx";

const Bottombar = () => {
  const { pathname } = useLocation();

  const [isMasterDataOpen, setIsMasterDataOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  useEffect(() => {
    setIsMasterDataOpen(false);
    setIsReportOpen(false);
    setIsSurveyOpen(false);
    if (pathname === "/corridor" || pathname.startsWith("/road-section")) {
      setIsMasterDataOpen(false);
    }
    if (
      pathname.startsWith("/road-survey") ||
      pathname.startsWith("/bridge-survey")
    ) {
      setIsSurveyOpen(false);
    }
    if (
      pathname === "/periodic" ||
      pathname === "/statistic" ||
      pathname === "/download"
    ) {
      setIsReportOpen(false);
    }
  }, [pathname]);

  const handleMasterDataClick = () => {
    setIsMasterDataOpen(!isMasterDataOpen);
    setIsReportOpen(false);
    setIsSurveyOpen(false);
  };

  const handleReportClick = () => {
    setIsReportOpen(!isReportOpen);
    setIsMasterDataOpen(false);
    setIsSurveyOpen(false);
  };

  const handleSurveyClick = () => {
    setIsSurveyOpen(!isSurveyOpen);
    setIsMasterDataOpen(false);
    setIsReportOpen(false);
  };

  return (
    <section className="z-50 flex justify-between w-full sticky bottom-0 rounded-t-[10px] bg-biru px-2 gap-[3px] py-4 md:hidden">
      <Link
        to="/dashboard"
        className={`${pathname === "/dashboard" ? "bg-kuning" : ""} flex items-center flex-col gap-2 w-[90px] p-2 transition rounded-xl`}
      >
        <Dashboard
          color={`${pathname === "/dashboard" ? "text-biru" : "text-white"} group-hover:text-biru transition-colors duration-300`}
        />
        <p
          className={`${pathname === "/dashboard" ? "text-biru" : "text-white"} text-[12px]`}
        >
          Dashboard
        </p>
      </Link>
      <Link
        to="#master"
        className={`${isMasterDataOpen || pathname.startsWith("/drainase") || pathname.startsWith("/road-section") ? "bg-kuning" : ""} flex items-center flex-col gap-2 w-[90px] py-2 px-0 transition rounded-xl`}
        onClick={handleMasterDataClick}
      >
        <Database
          className={`${isMasterDataOpen || pathname.startsWith("/drainase") || pathname.startsWith("/road-section") ? "text-biru" : "text-white"} group-hover:text-biru transition-colors duration-300`}
        />
        <p
          className={`${isMasterDataOpen || pathname.startsWith("/drainase") || pathname.startsWith("/road-section") ? "text-biru" : "text-white"}  text-[12px]`}
        >
          Master Data
        </p>
      </Link>
      {isMasterDataOpen && (
        <div className="w-40 h-32 bg-white absolute -mt-[150px] ml-16 shadow-md rounded-xl p-4 flex flex-col gap-2">
          <Link to="/drainase" className="text-biru text-lg">
            Drainase
          </Link>
          <Link to="/road-section" className="text-biru text-lg">
            Ruas Jalan
          </Link>
        </div>
      )}
      <Link
        to="#survey"
        className={`${isSurveyOpen || pathname.startsWith("/survey-drainase") || pathname.startsWith("/road-survey") || pathname.startsWith("/bridge-survey") ? "bg-kuning" : ""} flex items-center flex-col gap-2 w-[90px] py-2 px-0 transition rounded-xl`}
        onClick={handleSurveyClick}
      >
        <Survey
          color={`${isSurveyOpen || pathname.startsWith("/survey-drainase") || pathname.startsWith("/road-survey") || pathname.startsWith("/bridge-survey") ? "text-biru" : "text-white"} group-hover:text-biru transition-colors duration-300`}
        />
        <p
          className={`${isSurveyOpen || pathname.startsWith("/survey-drainase") || pathname.startsWith("/road-survey") || pathname.startsWith("/bridge-survey") ? "text-biru" : "text-white"}  text-[12px]`}
        >
          Survey
        </p>
      </Link>
      {isSurveyOpen && (
        <div className="w-40 h-48 bg-white absolute -mt-[215px] ml-36 shadow-md rounded-xl p-4 flex flex-col gap-2">
          <Link to="/survey-drainase" className="text-biru text-lg">
            Survey Drainase
          </Link>
          <Link to="/road-survey" className="text-biru text-lg">
            Survey Jalan
          </Link>
          <Link to="/bridge-survey" className="text-biru text-lg">
            Survey Jembatan
          </Link>
        </div>
      )}
      <Link
        to="#report"
        className={`${isReportOpen || pathname === "/periodic" || pathname === "/statistic" || pathname === "/download" ? "bg-kuning" : ""} flex items-center rounded-xl flex-col gap-2 p-2 w-[90px] transition`}
        onClick={handleReportClick}
      >
        <FileText
          className={`${isReportOpen || pathname === "/periodic" || pathname === "/statistic" || pathname === "/download" ? "text-biru" : "text-white"} group-hover:text-biru transition-colors duration-300`}
        />
        <p
          className={`${isReportOpen || pathname === "/periodic" || pathname === "/statistic" || pathname === "/download" ? "text-biru" : "text-white"}  text-[12px]`}
        >
          Laporan
        </p>
      </Link>
      {isReportOpen && (
        <div className="z-50 w-40 h-32 bg-white absolute -mt-[150px] mr-4 right-0 shadow-md rounded-xl p-4 flex flex-col gap-2">
          <Link to="/periodic" className="text-biru text-lg">
            Periodik
          </Link>
          <Link to="/statistic" className="text-biru text-lg">
            Statistik
          </Link>
          <Link to="/download" className="text-biru text-lg">
            Download
          </Link>
        </div>
      )}
    </section>
  );
};

export default Bottombar;
