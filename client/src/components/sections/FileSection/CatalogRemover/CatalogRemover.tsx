import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useFileActions from "@/hooks/use-file-actions";
import { useModal } from "@/hooks/use-modal";

const CatalogRemover = () => {
  const { deleteCatalog, deleteCatalogLoading } = useFileActions();

  const { hideModal, modalProps } = useModal();

  const handleRemove = () => {
    deleteCatalog({ fileId: modalProps!.fileId! });
    hideModal();
  };

  return (
    <Card className="w-full max-w-md py-4 px-2 dark:bg-neutral-900 bg-background transition-all">
      <CardContent className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Are you sure you want to Delete this catalog?
          </h1>
          <p className="text-md font-bold text-muted-foreground">
            This action is irreversible
          </p>
          <p className="text-md font-bold text-muted-foreground">
            All trashed files that were contained within this catalog will be
            available in root directory.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleRemove}
            variant="destructive"
            disabled={deleteCatalogLoading}
          >
            {deleteCatalogLoading ? "Removing..." : "Remove"}
          </Button>
          <Button
            onClick={hideModal}
            variant="outline"
            disabled={deleteCatalogLoading}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CatalogRemover;
