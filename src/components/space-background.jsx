// space-background.js

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const MAX_METEORS = 15; // Maximum number of meteors

export default function SpaceBackground() {
  // const [mounted, setMounted] = useState(false);
  // const [meteors, setMeteors] = useState([]);
  // const [dimensions, setDimensions] = useState({
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // });

  // useEffect(() => {
  //   setMounted(true);

  //   const handleResize = () => {
  //     setDimensions({ width: window.innerWidth, height: window.innerHeight });
  //   };

  //   window.addEventListener("resize", handleResize);

  //   const interval = setInterval(() => {
  //     setMeteors((prev) => {
  //       // Remove meteors older than 2 seconds
  //       const currentTime = Date.now();
  //       const filteredMeteors = prev.filter(
  //         (timestamp) => currentTime - timestamp < 2000
  //       );

  //       // Only add new meteor if we're below the limit
  //       if (filteredMeteors.length < MAX_METEORS) {
  //         return [...filteredMeteors, currentTime];
  //       }
  //       return filteredMeteors;
  //     });
  //   }, 2000);

  //   return () => {
  //     clearInterval(interval);
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  // if (!mounted) {
  //   return <div className="fixed inset-0 overflow-hidden bg-[#0a0a2e]" />;
  // }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0a0a2e]">
     </div>
  );
}
