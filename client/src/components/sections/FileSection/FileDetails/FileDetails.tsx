"use client";
import { useFile } from "@/hooks/use-file";
import { useModal } from "@/hooks/use-modal";
import FileMetaData from "./FileMetaData";
import FileActivityList from "./FileActivityList";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

const FileDetails = () => {
  const { modalProps } = useModal();
  const { allFiles, isLoading } = useFile();

  const [fileId, setFileId] = useState<number | null>(null);

  useEffect(() => {
    if (modalProps?.fileId) {
      setFileId(modalProps.fileId);
    }
  }, [modalProps?.fileId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const file = allFiles.find((file) => file.id === fileId);

  return (
    <Card className="p-4">
      <CardContent className="space-y-4">
        <FileMetaData file={file} />
        <div data-testid="divTest" className="border-t pt-4">
          {fileId && <FileActivityList fileId={fileId} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileDetails;
