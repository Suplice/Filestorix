import { useEffect, useRef, useState } from "react";

const useScrollPosition = (offset: number = 50) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollBackUp = () => {
    containerRef.current!.scroll({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        console.log(containerRef.current.scrollTop);
        setIsScrolled(containerRef.current.scrollTop > offset);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container?.removeEventListener("scroll", handleScroll);
      }
    };
  }, [offset, containerRef]);

  return { containerRef, isScrolled, scrollBackUp };
};

export default useScrollPosition;
