import React from "react";

function Spinner(props) {
  return (
    <div className={`mt-10 flex flex-row justify-center`}>
      {" "}
      <svg
        className="-ml-1 mr-3 h-20 w-20 animate-spin dark:text-white"
        viewBox="0 0 24 24"
        style={{ display: "block" }}
      >
        <circle
          className="opacity-10 dark:opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-50 dark:opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}

export default Spinner;