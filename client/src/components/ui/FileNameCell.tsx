import { UserFile } from "@/lib/types/file";
import FileIcon from "../sections/FileSection/FileCard/FileIcon";
import { FaStar } from "react-icons/fa";

interface FileNameCellProps {
  file: UserFile;
  handleFolderClick: (file: UserFile) => void;
  handleFileClick: (file: UserFile) => void;
}

const FileNameCell: React.FC<FileNameCellProps> = ({
  file,
  handleFileClick,
  handleFolderClick,
}) => {
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
