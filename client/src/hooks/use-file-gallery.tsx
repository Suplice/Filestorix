"use client";
import { CarouselApi } from "@/components/ui/carousel";
import { UserFile } from "@/lib/types/file";
import { useEffect, useState } from "react";
import { useFilePreviews } from "./use-file-previews";

const useFileGallery = (files: UserFile[]) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const previews = useFilePreviews(files);

  useEffect(() => {
    if (!carouselApi) return;

    const updateScrollButtons = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    updateScrollButtons();

    carouselApi.on("select", updateScrollButtons);

    carouselApi.scrollTo(0);

    return () => {
      carouselApi.off("select", updateScrollButtons);
    };
  }, [carouselApi, files, previews]);

  return {
    carouselApi,
    setCarouselApi,
    canScrollPrev,
    canScrollNext,
    previews,
  };
};

export default useFileGallery;
