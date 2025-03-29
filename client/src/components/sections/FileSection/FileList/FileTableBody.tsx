import {
  Table,
  TableBody,
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
}

const FileTableBody: React.FC<FileTableBodyProps> = ({ files, isLoading }) => {
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
      ) : files.length === 0 ? null : (
        <TableBody>
          {files.map((file) => (
            <FileCard file={file} key={file.id} />
          ))}
        </TableBody>
      )}
    </Table>
  );
};

export default FileTableBody;
