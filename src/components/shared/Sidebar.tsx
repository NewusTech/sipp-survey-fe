import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "@/assets/icons/Dashboard.tsx";
import { Database, FileText } from "lucide-react";
import Survey from "@/assets/icons/Survey.tsx";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [isMasterDataOpen, setIsMasterDataOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  useEffect(() => {
    setIsMasterDataOpen(false);
    setIsReportOpen(false);
    setIsSurveyOpen(false);
    if (
      pathname === "/drainase" ||
      pathname.startsWith("/road-section") ||
      pathname.startsWith("/drainase")
    ) {
      setIsMasterDataOpen(true);
    }
    if (
      pathname.startsWith("/road-survey") ||
      pathname.startsWith("/bridge-survey") ||
      pathname.startsWith("/survey-drainase")
    ) {
      setIsSurveyOpen(true);
    }
    if (
      pathname === "/periodic" ||
      pathname === "/statistic" ||
      pathname === "/download"
    ) {
      setIsReportOpen(true);
    }
  }, [pathname]);

  const handleMasterDataClick = () => {
    setIsMasterDataOpen((prevState) => !prevState);
    setIsReportOpen(false);
    setIsSurveyOpen(false);
  };

  const handleReportClick = () => {
    setIsReportOpen((prevState) => !prevState);
    setIsMasterDataOpen(false);
    setIsSurveyOpen(false);
  };

  const handleSurveyClick = () => {
    setIsSurveyOpen((prevState) => !prevState);
    setIsMasterDataOpen(false);
    setIsReportOpen(false);
  };

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
      <div className="h-full px-3 py-4 overflow-y-auto bg-biru">
        <div className="flex flex-col justify-center items-center mt-2">
          <div className="h-10 w-10 my-4">
            <img src="/assets/images/logo.jpg" alt="logo" />
          </div>
          <h1 className="uppercase font-medium text-white text-[20px] mt-2">
            Survey Kondisi Jalan
          </h1>
          <h3 className="text-white font-light text-[10px] opacity-80 uppercase tracking-wider">
            Dinas Bina Marga Tulang Bawang Barat
          </h3>
        </div>
        <ul className="space-y-2 text-white flex flex-col mt-10 mx-3">
          <li
            className={`font-normal group ${pathname === "/dashboard" ? "bg-kuning" : ""} hover:bg-kuning py-3 px-4 rounded-xl transition-colors duration-300`}
          >
            <Link
              to="/dashboard"
              className="flex gap-6 items-center cursor-pointer"
            >
              <Dashboard
                color={`${pathname === "/dashboard" ? "text-biru" : "text-white"} group-hover:text-biru transition-colors duration-300`}
              />
              <p
                className={`${pathname === "/dashboard" ? "text-biru" : "text-white"} group-hover:text-biru transition-colors duration-300`}
              >
                Dashboard
              </p>
            </Link>
          </li>

          <li
            className={`font-normal group ${isSurveyOpen || pathname.startsWith("/survey-drainase") || pathname.startsWith("/road-survey") || pathname.startsWith("/bridge-survey") ? "bg-kuning" : ""} hover:bg-kuning py-3 px-4 rounded-xl transition-colors duration-300`}
            onClick={handleSurveyClick}
          >
            <div className="flex gap-6 items-center cursor-pointer">
              {isSurveyOpen ? (
                <Survey color="text-biru" />
              ) : (
                <Survey
                  color={`${pathname.startsWith("/survey-drainase") || pathname.startsWith("/road-survey") || pathname.startsWith("/bridge-survey") ? "text-biru" : "text-white"} group-hover:text-biru transition-colors duration-300`}
                />
              )}
              <p
                className={`${isSurveyOpen || pathname.startsWith("/survey-drainase") || pathname.startsWith("/road-survey") || pathname.startsWith("/bridge-survey") ? "text-biru" : "text-white"} group-hover:text-biru transition-colors duration-300`}
              >
                Survey
              </p>
            </div>
          </li>
          {isSurveyOpen && (
            <div className="flex flex-col gap-3">
              <div
                className={`ml-16 px-4 border-l-4 gap-2 hover:border-l-kuning hover:text-kuning ${pathname.startsWith("/survey-drainase") ? "border-l-kuning text-kuning" : "border-l-biru text-white"} mt-1`}
              >
                <Link to="/survey-drainase" className="text-sm">
                  Survey Drainase
                </Link>
              </div>
              <div
                className={`ml-16 px-4 border-l-4 gap-2 hover:border-l-kuning hover:text-kuning ${pathname.startsWith("/road-survey") ? "border-l-kuning text-kuning" : "border-l-biru text-white"} mt-1`}
              >
                <Link to="/road-survey" className="text-sm">
                  Survey Jalan
                </Link>
              </div>
              <div
                className={`ml-16 px-4 border-l-4 gap-2 hover:border-l-kuning hover:text-kuning ${pathname.startsWith("/bridge-survey") ? "border-l-kuning text-kuning" : "border-l-biru text-white"} mt-1`}
              >
                <Link to="/bridge-survey" className="text-sm">
                  Survey Jembatan
                </Link>
              </div>
            </div>
          )}
          <li
            className={`font-normal group ${isReportOpen || pathname === "/periodic" || pathname === "/statistic" || pathname === "/download" ? "bg-kuning" : ""} hover:bg-kuning py-3 px-4 rounded-xl transition-colors duration-300`}
            onClick={handleReportClick}
          >
            <div className="flex gap-6 items-center cursor-pointer">
              {isReportOpen ? (
                <FileText className="text-biru" />
              ) : (
                <FileText
                  className={`${pathname === "/periodic" || pathname === "/statistic" || pathname === "/download" ? "text-biru" : "text-white"} group-hover:text-biru transition-colors duration-300`}
                />
              )}
              <p
                className={`${isReportOpen || pathname === "/periodic" || pathname === "/statistic" || pathname === "/download" ? "text-biru" : "text-white"} group-hover:text-biru transition-colors duration-300`}
              >
                Laporan
              </p>
            </div>
          </li>
          {isReportOpen && (
            <div className="flex flex-col gap-3">
              <div
                className={`ml-16 px-4 border-l-4 gap-2 hover:border-l-kuning hover:text-kuning ${pathname === "/periodic" ? "border-l-kuning text-kuning" : "border-l-biru text-white"} mt-1`}
              >
                <Link to="/periodic" className="text-sm">
                  Periodik
                </Link>
              </div>
              <div
                className={`ml-16 px-4 border-l-4 gap-2 hover:border-l-kuning hover:text-kuning ${pathname === "/statistic" ? "border-l-kuning text-kuning" : "border-l-biru text-white"} mt-1`}
              >
                <Link to="/statistic" className="text-sm">
                  Statistik
                </Link>
              </div>
              <div
                className={`ml-16 px-4 border-l-4 gap-2 hover:border-l-kuning hover:text-kuning ${pathname === "/download" ? "border-l-kuning text-kuning" : "border-l-biru text-white"} mt-1`}
              >
                <Link to="/download" className="text-sm">
                  Download
                </Link>
              </div>
            </div>
          )}
          <li
            className={`font-normal group ${isMasterDataOpen || pathname.startsWith("/drainase") || pathname.startsWith("/road-section") ? "bg-kuning" : ""} hover:bg-kuning py-3 px-4 rounded-xl transition-colors duration-300`}
            onClick={handleMasterDataClick}
          >
            <div className="flex gap-6 items-center cursor-pointer">
              {isMasterDataOpen ? (
                <Database className="text-biru" />
              ) : (
                <Database
                  className={`${pathname.startsWith("/drainase") || pathname.startsWith("/road-section") ? "text-biru" : "text-white"} group-hover:text-biru transition-colors duration-300`}
                />
              )}
              <p
                className={`${isMasterDataOpen || pathname.startsWith("/drainase") || pathname.startsWith("/road-section") ? "text-biru" : "text-white"} group-hover:text-biru transition-colors duration-300`}
              >
                Master Data
              </p>
            </div>
          </li>
          {isMasterDataOpen && (
            <div className="flex flex-col gap-3">
              <div
                className={`ml-16 px-4 border-l-4 gap-2 hover:border-l-kuning hover:text-kuning ${pathname.startsWith("/drainase") ? "border-l-kuning text-kuning" : "border-l-biru text-white"} mt-1`}
              >
                <Link to="/drainase" className="text-sm">
                  Drainase
                </Link>
              </div>
              <div
                className={`ml-16 px-4 border-l-4 gap-2 hover:border-l-kuning hover:text-kuning ${pathname.startsWith("/road-section") ? "border-l-kuning text-kuning" : "border-l-biru text-white"} mt-1`}
              >
                <Link to="/road-section" className="text-sm">
                  Ruas Jalan
                </Link>
              </div>
            </div>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
