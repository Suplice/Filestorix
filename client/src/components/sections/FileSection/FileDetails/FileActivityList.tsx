import { useAuth } from "@/context/AuthContext";
import { fetchFileActivityList } from "@/lib/api/file/filesApi";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import FileActivityItem from "./FileActivityItem";
import { Button } from "@/components/ui/button";

interface FileActivityListProps {
  fileId: number;
}

const FileActivityList: React.FC<FileActivityListProps> = ({ fileId }) => {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["activitylog", fileId],
    queryFn: () => fetchFileActivityList(fileId),
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p className="text-center text-red-500">Error loading activities.</p>
        <Button onClick={() => refetch}>Try again.</Button>
      </div>
    );
  }

  return (
    <div className="p-4 ">
      <h2 className="text-2xl font-bold text-primary mb-4 ">File Activity</h2>
      {data && data.length === 0 ? (
        <Card className="text-center py-4">
          <CardContent className="text-muted-foreground">
            No activity found.
          </CardContent>
        </Card>
      ) : (
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
              {data?.map((activity) => (
                <FileActivityItem key={activity.id} activityLog={activity} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FileActivityList;
