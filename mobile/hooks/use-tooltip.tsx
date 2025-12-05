import { ScreenSize } from "@/lib/types/common";
import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

const useTooltip = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

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
