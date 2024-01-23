import { useEffect, useRef } from "react";

//Styles
import "./Preloader.css";

function Preloader() {
  // Assuming you have a ref for the preloader
  const preloaderRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      preloaderRef.current.style.display = "none";
    }, 1000);
  }, []); // Empty dependency array to run the effect only once

  return (
    <div className="preloader" ref={preloaderRef}>
      <svg viewBox="0 0 102 102" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          className="big-circle"
          d="M101 51C101 78.6142 78.6142 101 51 101C23.3858 101 1 78.6142 1 51"
          stroke="#60CB5B"
          strokeWidth="2"
        />
        <path
          className="small-circle"
          d="M91 51C91 28.9086 73.0914 11 51 11C28.9086 11 11 28.9086 11 51"
          stroke="#60CB5B"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export default Preloader;
