import { useEffect } from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  useEffect(() => {
    document.title = "Sistem Informasi Pelaksanaan, Pengawasan, Pelaporan";
  }, []);

  return (
    <main className="bg-[#FDFDFD] w-full h-[screen">
      <section className="flex flex-col">
        <div className="flex justify-between md:container md:mx-auto px-2 md:px-10 py-5">
          <div className="flex flex-col md:flex-row items-center justify-center">
            <img
              src="/assets/images/tubaba.png"
              alt="tubaba"
              className="h-16 w-12 md:h-[83px] md:w-[60px]"
            />
            <div className="ml-0 md:ml-9 text-center md:text-left mt-2 md:-mt-2">
              <h2 className="text-xs md:text-lg tracking-widest uppercase text-biru font-semibold">
                Sistem Informasi
              </h2>
              <p className="text-xs md:text-lg tracking-widest uppercase text-biru">
                Pelaksanaan, Pengawasan, Pelaporan
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center">
            <img
              src="/assets/images/logo.jpg"
              alt="tubaba"
              className="w-12 h-12 md:h-[50px] md:w-[50px] -mt-5 md:-mt-2"
            />
            <div className="ml-0 md:ml-9 md:text-left text-center xss:mt-2 xs:mt-6 md:-mt-2">
              <p className="text-xs lg:text-lg tracking-widest text-biru">
                Dinas Pekerjaan Umum <br className="hidden md:inline" /> dan
                Penataan Ruang
              </p>
            </div>
          </div>
        </div>
        <div className="md:hidden mt-32"></div>
        <div className="flex flex-col items-center">
          <img
            src="/assets/images/peta.png"
            alt="peta"
            className="absolute z-20 md:h-[520px] md:w-[920px] h-56 w-62 -rotate-90 md:rotate-0"
          />
          <img
            src="/assets/images/batik.png"
            alt="batik"
            className="hidden md:inline md:mt-40"
          />
        </div>
        <div className="mt-1 flex justify-between">
          <img
            src="/assets/icons/line.svg"
            alt="line"
            className="hidden md:inline w-[105px] md:w-[35%]"
          />
          <img
            src="/assets/icons/line-2.svg"
            alt="line"
            className="hidden md:inline md:w-[35%]"
          />
        </div>
        <div className="mt-80 flex justify-center items-center gap-20 md:gap-5 md:-mt-[90px] z-30">
          <a
            href="https://anggaran.sipp-tubabakab.com"
            target="_blank"
            className="w-16 h-16 md:h-[138px] md:w-[138px] rounded-full bg-[#FEC830] transition-colors duration-300 hover:bg-[#FFBE05] flex flex-col items-center justify-center gap-2 shadow-custom"
          >
            <img
              src="/assets/icons/SIPPP.svg"
              alt="sippp"
              className="h-5 w-5 md:w-10 md:h-10"
            />
            <p className="tracking-widest uppercase text-black font-semibold md:text-xs text-[8px]">
              Sippp
            </p>
          </a>
          <Link
            to="/dashboard"
            className="w-16 h-16 md:h-[138px] md:w-[138px] rounded-full bg-biru transition-colors duration-300 hover:bg-biru-2 flex flex-col items-center justify-center gap-2 shadow-custom"
          >
            <img
              src="/assets/icons/survey-2.svg"
              alt="survey"
              className="w-5 h-5 md:w-10 md:h-10"
            />
            <p className="tracking-widest uppercase text-white font-semibold text-[8px] md:text-xs">
              Survey
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
};
export default LandingPage;
