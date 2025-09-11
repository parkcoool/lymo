import { useEffect } from "react";

import { useAppBarStore } from "~/contexts/useAppBarStore";

export default function useHomePageAppBarEffect() {
  const { setOverrideVariant, resetOverrideVariant } = useAppBarStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 390) {
        setOverrideVariant("home");
      } else {
        resetOverrideVariant();
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      resetOverrideVariant();
    };
  }, []);
}
