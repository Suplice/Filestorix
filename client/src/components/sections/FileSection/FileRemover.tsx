import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useFileActions from "@/hooks/use-file-actions";
import { useModal } from "@/hooks/use-modal";

const FileRemover = () => {
  const { removeFile, removeFileLoading } = useFileActions();

  const { hideModal, modalProps } = useModal();

  const handleRemove = () => {
    if (modalProps && modalProps.fileId) {
      removeFile({ fileId: modalProps.fileId });
      hideModal();
    }
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
          <Button
            onClick={handleRemove}
            variant="destructive"
            disabled={removeFileLoading}
          >
            {removeFileLoading ? "Removing..." : "Remove"}
          </Button>
          <Button
            onClick={hideModal}
            variant="outline"
            disabled={removeFileLoading}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileRemover;
