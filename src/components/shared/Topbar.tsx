import { ChevronDown, LogOut, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import Cookies from "js-cookie";

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // const photo = Cookies.get("photo");
  // const url = import.meta.env.VITE_APP_URL;

  const handleLogout = () => {
    // Perform logout logic here
    Cookies.remove("adsxcl");
    Cookies.remove("name");
    Cookies.remove("email");
    Cookies.remove("id");
    window.location.reload();
    navigate("/sign-in");
  };

  const getTitle = (pathname: string): string => {
    if (
      pathname.startsWith("/bridge-survey") ||
      pathname.startsWith("/road-survey") ||
      pathname.startsWith("/survey-drainase")
    ) {
      return "Survey";
    } else if (
      pathname.startsWith("/road-section") ||
      pathname.startsWith("/drainase") ||
      pathname.startsWith("/corridor")
    ) {
      return "Master Data";
    } else if (
      pathname.startsWith("/periodic") ||
      pathname.startsWith("/statistic") ||
      pathname.startsWith("/download")
    ) {
      return "Laporan";
    } else {
      return "Dashboard";
    }
  };

  return (
    <header className="p-4 sm:ml-64 bg-white flex justify-between items-center">
      <h1 className="ml-9 font-semibold text-3xl text-abu">
        {getTitle(location.pathname)}
      </h1>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full bg-white shadow-md md:w-[180px] hover:bg-slate-50 h-10">
          <div className="flex items-center justify-between">
            <ChevronDown className="w-4 ml-3 text-biru md:block hidden" />
            <div className="px-4 hidden md:flex md:flex-col items-start">
              <h5 className="text-sm text-black left-0">Jennie Kim</h5>
              <p className="text-[10px] text-gray-500">Admin</p>
            </div>
            <div className="w-8 h-8 rounded-full m-1 md:mr-2 md:ml-0">
              <img
                src="/assets/icons/profile-placeholder.svg"
                alt="user"
                className="object-cover"
              />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="py-2">
          <DropdownMenuItem>
            <Link
              to="/update-profile"
              className="flex gap-2 items-center cursor-pointer"
            >
              <User className="text-biru w-4" />
              <p>Profile</p>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="text-biru w-4" />
              <p>Logout</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Topbar;
