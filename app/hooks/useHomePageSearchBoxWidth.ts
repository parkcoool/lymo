import { useEffect, useState } from "react";

export default function useHomePageSearchBoxWidth() {
  const [width, setWidth] = useState<number>(100);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      if (y <= 100) {
        setWidth(100);
      } else if (y <= 300) {
        setWidth(70 + (300 - y) * (30 / 200));
      } else {
        setWidth(70);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return width;
}
