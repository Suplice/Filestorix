import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const useSidebarWidth = () => {
  const sidebarWidth = useSelector((state: RootState) => state.ui.sidebarWidth);

  const handleMouseDown = () => {
    console.log("Resize not supported on mobile");
  };

  return {
    tempWidth: sidebarWidth,
    sidebarWidth,
    handleMouseDown,
  };
};

export default useSidebarWidth;
