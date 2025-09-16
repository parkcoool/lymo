import { useState, useEffect } from "react";

export default function useSearchBoxVisible() {
  const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const anchor = window.innerHeight * 0.2 + 180;

      if (window.scrollY < anchor) {
        setIsSearchBoxVisible(true);
      } else {
        setIsSearchBoxVisible(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return isSearchBoxVisible;
}
