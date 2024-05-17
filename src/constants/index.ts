export const sideBarLinks = [
  {
    icons: "/assets/icons/dashboard.svg",
    icons2: "assets/icons/dashboard-active.svg",
    route: "/",
    label: "Dashboard",
  },
  {
    icons: "/assets/icons/database.svg",
    icons2: "assets/icons/database-active.svg",
    route: "#master",
    label: "Master Data",
    children: [
      {
        route: "/corridor",
        label: "Koridor",
      },
      {
        route: "/road-section",
        label: "Ruas Jalan",
      },
    ],
  },
  {
    icons: "/assets/icons/survey.svg",
    icons2: "assets/icons/survey-active.svg",
    route: "/survey",
    label: "Survey",
  },
  {
    icons: "/assets/icons/document.svg",
    icons2: "assets/icons/document-active.svg",
    route: "#report",
    label: "Laporan",
    children: [
      {
        route: "/periodic",
        label: "Periodik",
      },
      {
        route: "/statistic",
        label: "Statistik",
      },
      {
        route: "/download",
        label: "Download",
      },
    ],
  },
];

export const months = [
  {
    id: 1,
    name: "Januari",
  },
  {
    id: 2,
    name: "Februari",
  },
  {
    id: 3,
    name: "Maret",
  },
  {
    id: 4,
    name: "April",
  },
  {
    id: 5,
    name: "Mei",
  },
  {
    id: 6,
    name: "Juni",
  },
  {
    id: 7,
    name: "Juli",
  },
  {
    id: 8,
    name: "Agustus",
  },
  {
    id: 9,
    name: "September",
  },
  {
    id: 10,
    name: "Oktober",
  },
  {
    id: 11,
    name: "November",
  },
  {
    id: 12,
    name: "Desember",
  },
];
