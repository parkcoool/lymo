import { useEffect } from "react";

import { useAppBarStore } from "~/contexts/useAppBarStore";

export default function useHomePageAppBarEffect() {
  const { setOverrideVariant, resetOverrideVariant } = useAppBarStore();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setOverrideVariant("none");
        } else {
          resetOverrideVariant();
        }
      });
    });

    const searchSection = document.getElementById("search-box");
    if (searchSection) {
      observer.observe(searchSection);
    }

    return () => {
      if (searchSection) {
        observer.unobserve(searchSection);
      }
      observer.disconnect();
      resetOverrideVariant();
    };
  }, []);
}
