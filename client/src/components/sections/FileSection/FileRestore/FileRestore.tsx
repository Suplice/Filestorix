import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useFileActions from "@/hooks/use-file-actions";
import { useModal } from "@/hooks/use-modal";

const FileRestore = () => {
  const { restoreFile, restoreFileLoading } = useFileActions();

  const { hideModal, modalProps } = useModal();

  const handleRestore = () => {
    restoreFile({
      fileId: modalProps!.fileId!,
      parentId: modalProps!.parentId!,
    });
    hideModal();
  };

  return (
    <Card className="w-full max-w-md py-4 px-2 dark:bg-neutral-900 bg-background transition-all">
      <CardContent className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Are you sure you want to restore this file?
          </h1>
          <p className="text-md font-bold text-muted-foreground">
            It will be restored within it&apos;s original catalog if it exists.
          </p>
          <p className="text-md font-bold text-muted-foreground">
            If original catalog was deleted it will be restored within drive
            root.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleRestore}
            variant="destructive"
            disabled={restoreFileLoading}
          >
            {restoreFileLoading ? "Restoring..." : "Restore"}
          </Button>
          <Button
            onClick={hideModal}
            variant="outline"
            disabled={restoreFileLoading}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileRestore;
