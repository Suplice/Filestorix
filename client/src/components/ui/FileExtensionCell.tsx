import { UserFile } from "@/lib/types/file";

interface FileExtensionCellProps {
  file: UserFile;
}

const FileExtensionCell: React.FC<FileExtensionCellProps> = ({ file }) => {
  return (
    <p className="capitalize">{file.extension.toUpperCase().substring(1)}</p>
  );
};

export default FileExtensionCell;
