"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFileActions from "@/hooks/use-file-actions";
import { useModal } from "@/hooks/use-modal";
import { renameFileSchema } from "@/lib/schemas/fileRelatedSchemas";
import { RenameFileForm } from "@/lib/types/forms";

const FileRenamer = () => {
  const { renameFile, renameFileLoading } = useFileActions();
  const { hideModal, modalProps } = useModal();

  const form = useForm<RenameFileForm>({
    resolver: zodResolver(renameFileSchema),
    defaultValues: { name: "" },
  });

  const handleSubmit = (data: RenameFileForm) => {
    renameFile({ name: data.name, fileId: modalProps!.fileId! });
    hideModal();
  };

  return (
    <Card className="w-full max-w-md shadow-lg rounded-2xl p-6 bg-background">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Rename File</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-name">New File Name</Label>
            <Input
              id="file-name"
              type="text"
              autoComplete="off"
              className="focus:ring focus:ring-primary focus:outline-none"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={renameFileLoading} className="w-full">
            {renameFileLoading ? "Renaming..." : "Rename File"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FileRenamer;
