"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFile } from "@/hooks/use-file";
import { useModal } from "@/hooks/use-modal";

const FileTrasher = () => {
  const { trashFile } = useFile();

  const { hideModal, modalProps } = useModal();

  const handleTrash = () => {
    console.log("elo");
    trashFile({ fileId: modalProps!.fileId! });
    hideModal();
  };

  return (
    <Card className="w-full max-w-md py-4 px-2 dark:bg-neutral-900 bg-background transition-all">
      <CardContent className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Are you sure you want to trash this file?
          </h1>
          <p className="text-sm text-muted-foreground">
            Later you can reverse this action in the Trash section.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={handleTrash} variant="destructive">
            Trash
          </Button>
          <Button onClick={hideModal} variant="outline">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileTrasher;
