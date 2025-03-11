import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFile } from "@/hooks/use-file";
import { useModal } from "@/hooks/use-modal";

const FileRemover = () => {
  const { removeFile } = useFile();

  const { hideModal, modalProps } = useModal();

  const handleTrash = () => {
    removeFile({ fileId: modalProps!.fileId! });
    hideModal();
  };

  return (
    <Card className="w-full max-w-md py-4 px-2 dark:bg-neutral-900 bg-background transition-all">
      <CardContent className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Are you sure you want to Delete this file?
          </h1>
          <p className="text-md font-bold text-muted-foreground">
            This action is irreversible
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={handleTrash} variant="destructive">
            Remove
          </Button>
          <Button onClick={hideModal} variant="outline">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileRemover;
