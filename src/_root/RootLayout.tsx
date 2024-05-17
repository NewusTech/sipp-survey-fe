import { Outlet } from "react-router-dom";
import Topbar from "@/components/shared/Topbar";
import Sidebar from "@/components/shared/Sidebar";
import Bottombar from "@/components/shared/Bottombar.tsx";

const RootLayout = () => {
  return (
    <div className="w-full flex flex-col md:flex">
      <Topbar />
      <Sidebar />
      <section className="flex flex-1 h-full">
        <Outlet />
      </section>
      <Bottombar />
    </div>
  );
};

export default RootLayout;
