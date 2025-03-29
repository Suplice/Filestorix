"use client";
import { useModal } from "@/hooks/use-modal";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const MainEmptyList = () => {
  const parentId = useSelector((state: RootState) => state.location.parentId);
  const { showModal } = useModal();
  const handleClick = () => {
    showModal("FileUploader", { parentId: parentId });
  };

  return (
    <div className="w-full  flex items-center justify-center flex-col mt-8">
      <div
        className="flex items-center justify-center gap-2 flex-col cursor-pointer"
        onClick={handleClick}
      >
        <img
          src="/empty_file_list.png"
          alt="test"
          className="h-48 aspect-auto "
        ></img>
        <h1 className="text-2xl font-semibold">No files found</h1>
        <p>Drop files in here or click to upload.</p>
      </div>
    </div>
  );
};

export default MainEmptyList;
