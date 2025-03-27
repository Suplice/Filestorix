import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserFile } from "@/lib/types/file";
import FileTableSkeleton from "./FileTableSkeleton";
import FileCard from "../FileCard/FileCard";

interface FileTableBodyProps {
  files: UserFile[];
  isLoading: boolean;
  handleFolderClick: (file: UserFile) => void;
}

const FileTableBody: React.FC<FileTableBodyProps> = ({
  files,
  isLoading,
  handleFolderClick,
}) => {
  return (
    <Table className="select-none w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[20%]">Name</TableHead>
          <TableHead className="w-[15%]">Modified At</TableHead>
          <TableHead className="w-[15%]">Size</TableHead>
          <TableHead className="w-[15%]">Type</TableHead>
          <TableHead className="w-[15%]"></TableHead>
          <TableHead className="w-[5%] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      {isLoading ? (
        <FileTableSkeleton />
      ) : (
        <TableBody>
          {files.length === 0 ? (
            <TableRow>
              <TableCell>No files found</TableCell>
            </TableRow>
          ) : (
            files.map((file) => (
              <FileCard
                file={file}
                key={file.id}
                handleFolderClick={handleFolderClick}
              />
            ))
          )}
        </TableBody>
      )}
    </Table>
  );
};

export default FileTableBody;
