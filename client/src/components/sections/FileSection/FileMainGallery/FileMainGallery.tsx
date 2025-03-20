"use client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useFilePreviews } from "@/hooks/use-file-previews";
import { UserFile } from "@/lib/types/file";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import FileMainGalleryCard from "./FileMainGalleryCard";

interface FileMainGalleryProps {
  files: UserFile[];
}

const FileMainGallery: React.FC<FileMainGalleryProps> = ({ files }) => {
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

  return (
    <section className="py-0">
      <div className="container">
        <div className="flex flex-col justify-between md:flex-row md:items-end mb-4">
          <div className="mt-0 flex shrink-0 items-center justify-start w-full gap-2">
            <Button
              data-testid="leftButtonTest"
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              data-testid="rightButtonTest"
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 100%)": { dragFree: true },
            },
          }}
          className="relative left-[-1rem]"
        >
          <CarouselContent className="mx-4 mb-4">
            {files.map((file) => (
              <CarouselItem key={file.id} className="pl-4 md:max-w-[312px]">
                <FileMainGalleryCard
                  file={file}
                  previewUrl={previews[file.id]}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default FileMainGallery;
