import FileTable from "./FileTable";
import FileTableHeader from "./FileTableHeader";

const FileList = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden gap-4">
      <FileTableHeader />
      <FileTable />
    </div>
  );
};

export default FileList;
