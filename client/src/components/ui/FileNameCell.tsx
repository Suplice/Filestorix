import { UserFile } from "@/lib/types/file";
import FileIcon from "../sections/FileSection/FileCard/FileIcon";
import { FaStar } from "react-icons/fa";
import useFileHandlers from "@/hooks/use-file-handlers";

interface FileNameCellProps {
  file: UserFile;
}

const FileNameCell: React.FC<FileNameCellProps> = ({ file }) => {
  const { handleFolderClick, handleFileClick } = useFileHandlers();

  return (
    <div className="flex flex-row gap-3 items-center">
      <FileIcon extension={file.extension} />
      <span
        className={`font-medium cursor-pointer truncate flex flex-row items-center gap-2 ${
          file.isHidden ? "text-gray-500" : ""
        }`}
        onClick={() =>
          file.type === "CATALOG"
            ? handleFolderClick(file)
            : handleFileClick(file)
        }
      >
        {file.name}
        {file.isFavorite && <FaStar className="w-4 h-4" />}
      </span>
    </div>
  );
};

export default FileNameCell;
