import FileTable from "./FileTable";
import FileTableHeader from "./FileTableHeader";

interface FileListProps {
  section: "Recent" | "Favorite" | "Trash" | "Main";
}

const FileList: React.FC<FileListProps> = ({ section }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden gap-4">
      <FileTableHeader section={section} />
      <FileTable section={section} />
    </div>
  );
};

export default FileList;
