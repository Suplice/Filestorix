"use client";
import { fetchFileActivityList } from "@/lib/api/file/filesApi";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import { useEffect, useState } from "react";
import { ActivityLog } from "@/lib/types/activityLog";
import FileActivityListBody from "./FileActivityListBody";

interface FileActivityListProps {
  fileId: number;
}

const FileActivityList: React.FC<FileActivityListProps> = ({ fileId }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["activitylog", fileId],
    queryFn: async () => await fetchFileActivityList(fileId),
    enabled: !!fileId,
  });

  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (data) {
      setActivities(data);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div>
        <p className="text-center text-red-500">Error loading activities.</p>
        <Button onClick={() => refetch()}>Try again.</Button>
      </div>
    );
  }

  return (
    <div className="p-4 ">
      <h2 className="text-2xl font-bold text-primary mb-4 ">File Activity</h2>
      {activities && activities.length === 0 ? (
        <Card className="text-center py-4">
          <CardContent className="text-muted-foreground">
            No activity found.
          </CardContent>
        </Card>
      ) : (
        <FileActivityListBody activities={activities} />
      )}
    </div>
  );
};

export default FileActivityList;
