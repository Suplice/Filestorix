import { RootState } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarWidth as storeSetSidebarWidth } from "@/store/uiSlice";

const minWidth = 0;
const maxWidth = 200;

const useSidebarWidth = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const width = useSelector((state: RootState) => state.ui.sidebarWidth);
  const [tempWidth, setTempWidth] = useState<number>(width);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [lastMousePos, setLastMousePos] = useState<number>(0);

  const setSidebarWidth = (newWidth: number) => {
    dispatch(storeSetSidebarWidth(newWidth));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isMouseDown) return;

    const deltaX = e.clientX - lastMousePos;
    const newTempWidth = Math.min(
      Math.max(tempWidth + deltaX, minWidth),
      maxWidth
    );

    setTempWidth(newTempWidth);
    setLastMousePos(e.clientX);
  };

  const handleMouseUp = () => {
    if (isMouseDown) {
      setSidebarWidth(tempWidth);
      setIsMouseDown(false);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    setIsMouseDown(true);
    setLastMousePos(e.clientX);
  };

  useEffect(() => {
    if (isMouseDown) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMouseDown, tempWidth]);

  return {
    sidebarRef,
    tempWidth,
    width,
    handleMouseDown,
  };
};

export default useSidebarWidth;
