import { useFile } from "@/hooks/use-file";
import { useModal } from "@/hooks/use-modal";
import FileMetaData from "./FileMetaData";
import FileActivityList from "./FileActivityList";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";

const FileDetails = () => {
  const { modalProps } = useModal();
  const { files, isLoading } = useFile();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const file = files.find((file) => file.id === modalProps!.fileId!);

  return (
    <Card className="p-4">
      <CardContent className="space-y-4">
        <FileMetaData file={file} />
        <div className="border-t pt-4">
          <FileActivityList fileId={modalProps!.fileId!} />
        </div>
      </CardContent>
    </Card>
  );
};

export default FileDetails;
