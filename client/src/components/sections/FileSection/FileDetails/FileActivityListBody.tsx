import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FileActivityItem from "./FileActivityItem";
import { ActivityLog } from "@/lib/types/activityLog";
import useScrollPosition from "@/hooks/use-scroll-position";
import ScrollBackUp from "../ScrollBackUp";

interface FileActivityListBodyProps {
  activities: ActivityLog[];
}

const FileActivityListBody: React.FC<FileActivityListBodyProps> = ({
  activities,
}) => {
  const { containerRef, isScrolled, scrollBackUp } = useScrollPosition(50);

  return (
    <div
      ref={containerRef}
      className="max-h-[300px] overflow-y-auto no-scrollbar  "
    >
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

      {isScrolled && <ScrollBackUp onClick={scrollBackUp} />}
    </div>
  );
};

export default FileActivityListBody;
