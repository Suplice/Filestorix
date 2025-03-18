import { TableRow, TableCell } from "@/components/ui/table";
import { ActivityLog } from "@/lib/types/activityLog";

interface FileActivityItemProps {
  activityLog: ActivityLog;
}

const FileActivityItem: React.FC<FileActivityItemProps> = ({ activityLog }) => {
  return (
    <TableRow>
      <TableCell>{activityLog.action}</TableCell>
      <TableCell>
        {new Date(activityLog.performedAt).toLocaleString()}
      </TableCell>
      <TableCell>{activityLog.details || "No details available"}</TableCell>
    </TableRow>
  );
};

export default FileActivityItem;
