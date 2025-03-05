import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

const headers = ["Name", "Size", "Type", "Date"];

interface FileTableHeaderProps {
  section: "Recent" | "Favorite" | "Trash" | "Main";
}

const FileTableHeader: React.FC<FileTableHeaderProps> = ({ section }) => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-muted/80 text-muted-foreground font-medium border-b place-items-start">
      {headers.map((header) => (
        <Button variant="ghost" key={header}>
          {header}
          <ArrowUp size={16} />
        </Button>
      ))}
    </div>
  );
};

export default FileTableHeader;
