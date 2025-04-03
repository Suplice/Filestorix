import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarWidth } from "@/store/uiSlice";

const minWidth = 100;
const maxWidth = 400;

const useSidebarWidth = () => {
  const dispatch = useDispatch();
  const sidebarWidth = useSelector((state: RootState) => state.ui.sidebarWidth);

  const [tempWidth, setTempWidth] = useState(sidebarWidth);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
      setTempWidth(newWidth);
      console.log(newWidth);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        dispatch(setSidebarWidth(tempWidth));
        setIsDragging(false);
      }
    };

    if (isDragging) {
      console.log("i am dragging");
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, tempWidth, dispatch]);

  const handleMouseDown = () => setIsDragging(true);

  return {
    tempWidth,
    sidebarWidth,
    handleMouseDown,
  };
};

export default useSidebarWidth;
