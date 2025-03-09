import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const FileTableSkeleton: React.FC = () => {
  return (
    <TableBody>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-32" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>

          <TableCell className="text-right">
            <Skeleton className="h-5 w-5" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default FileTableSkeleton;
