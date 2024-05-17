type SurveyProps = {
  color: string;
};

const Survey = ({ color }: SurveyProps) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 12.0393C0 5.92424 4.56071 0.87592 10.4615 0.119646V3.13097C6.22391 3.86087 3 7.55394 3 12C3 16.9706 7.02944 21 12 21C14.1862 21 16.1904 20.2205 17.7497 18.9242L19.9041 21.0818C17.7929 22.9341 15.0274 24.0568 12 24.0568C5.37258 24.0568 0 18.6764 0 12.0393ZM19.4136 17.1043L21.5816 19.2755C23.0997 17.2626 24 14.7562 24 12.0393C24 5.71327 19.1192 0.52887 12.9231 0.0568314V3.04676C17.46 3.50898 21 7.34108 21 12C21 13.8954 20.4141 15.6539 19.4136 17.1043Z"
        fill="currentColor"
        className={color}
      />
    </svg>
  );
};

export default Survey;
