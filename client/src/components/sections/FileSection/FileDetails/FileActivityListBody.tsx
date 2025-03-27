import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FileActivityItem from "./FileActivityItem";
import { ActivityLog } from "@/lib/types/activityLog";

interface FileActivityListBodyProps {
  activities: ActivityLog[];
}

const FileActivityListBody: React.FC<FileActivityListBodyProps> = ({
  activities,
}) => {
  return (
    <div className="max-h-[300px] overflow-y-auto no-scrollbar relative ">
      <Table>
        <TableHeader className="sticky w-full bg-background">
          <TableRow>
            <TableHead className="w-[30%]">Action</TableHead>
            <TableHead className="w-[30%]">Date</TableHead>
            <TableHead className="w-[40%]">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <FileActivityItem key={activity.id} activityLog={activity} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FileActivityListBody;
