type DashboardProps = {
  color: string;
};

const Dashboard = ({ color }: DashboardProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="10.72"
        height="13.28"
        fill="currentColor"
        className={color}
      />
      <rect
        x="13.28"
        y="10.56"
        width="10.72"
        height="13.28"
        fill="currentColor"
        className={color}
      />
      <rect
        x="13.28"
        width="10.72"
        height="8"
        fill="currentColor"
        className={color}
      />
      <rect
        y="16"
        width="10.72"
        height="8"
        fill="currentColor"
        className={color}
      />
    </svg>
  );
};

export default Dashboard;
