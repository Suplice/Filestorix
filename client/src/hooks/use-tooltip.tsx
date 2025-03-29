"use client";
import { ScreenSize } from "@/lib/types/common";
import { useEffect, useMemo, useState } from "react";

const useTooltip = () => {
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const {
    isTooltipVisibleSM,
    isTooltipVisibleMD,
    isTooltipVisibleLG,
    isTooltipVisibleXL,
    isTooltipVisibleXXL,
  } = useMemo(() => {
    return {
      isTooltipVisibleSM: screenWidth < ScreenSize.SM,
      isTooltipVisibleMD: screenWidth < ScreenSize.MD,
      isTooltipVisibleLG: screenWidth < ScreenSize.LG,
      isTooltipVisibleXL: screenWidth < ScreenSize.XL,
      isTooltipVisibleXXL: screenWidth < ScreenSize.XXL,
    };
  }, [screenWidth]);

  return {
    isTooltipVisibleSM,
    isTooltipVisibleMD,
    isTooltipVisibleLG,
    isTooltipVisibleXL,
    isTooltipVisibleXXL,
    screenWidth,
    screenHeight,
  };
};

export default useTooltip;
