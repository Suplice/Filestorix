import { Card, CardContent } from "@/components/ui/card";
import { UserFile } from "@/lib/types/file";
import { formatFileSize } from "@/lib/utils/utils";

interface FileMetaDataProps {
  file?: UserFile;
}

const FileMetaData: React.FC<FileMetaDataProps> = ({ file }) => {
  if (!file) {
    return <p className="text-muted-foreground">No metadata available.</p>;
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">{file.name}</h2>

        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <p>
            <span className="font-medium">Extension:</span> {file.extension}
          </p>
          <p>
            <span className="font-medium">Type:</span> {file.type}
          </p>
          <p>
            <span className="font-medium">Size:</span>{" "}
            {formatFileSize(file.size)}
          </p>
          <p>
            <span className="font-medium">Created at:</span>{" "}
            {new Date(file.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Modified at:</span>{" "}
            {new Date(file.modifiedAt).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Trashed:</span>{" "}
            {file.isTrashed ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-medium">Favorite:</span>{" "}
            {file.isFavorite ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-medium">Hidden:</span>{" "}
            {file.isHidden ? "Yes" : "No"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileMetaData;
