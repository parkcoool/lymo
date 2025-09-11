import { useEffect, useState } from "react";

const getWidth = () => {
  const y = window.scrollY;

  if (y <= 100) {
    return 100;
  } else if (y <= 300) {
    return 70 + (300 - y) * (30 / 200);
  } else {
    return 70;
  }
};

export default function useHomePageSearchBoxWidth() {
  const [width, setWidth] = useState<number>(getWidth());

  useEffect(() => {
    const handleScroll = () => {
      setWidth(getWidth());
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return width;
}
