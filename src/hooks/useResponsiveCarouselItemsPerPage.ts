"use client";

import { useEffect, useState } from "react";

export default function useResponsiveCarouselItemsPerPage() {
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useEffect(() => {
    const tabletQuery = window.matchMedia("(min-width: 768px)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const updateItemsPerPage = () => {
      setItemsPerPage(desktopQuery.matches ? 3 : tabletQuery.matches ? 2 : 1);
    };

    updateItemsPerPage();
    tabletQuery.addEventListener("change", updateItemsPerPage);
    desktopQuery.addEventListener("change", updateItemsPerPage);

    return () => {
      tabletQuery.removeEventListener("change", updateItemsPerPage);
      desktopQuery.removeEventListener("change", updateItemsPerPage);
    };
  }, []);

  return itemsPerPage;
}
