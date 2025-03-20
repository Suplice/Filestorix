"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import useFileActions from "@/hooks/use-file-actions";
import { useModal } from "@/hooks/use-modal";
import { addCatalogSchema } from "@/lib/schemas/fileRelatedSchemas";
import { AddCatalogForm } from "@/lib/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const CatalogUploader = () => {
  const { uploadCatalog, uploadCatalogLoading } = useFileActions();
  const { hideModal, modalProps } = useModal();

  const form = useForm<AddCatalogForm>({
    resolver: zodResolver(addCatalogSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = (data: AddCatalogForm) => {
    if (modalProps !== undefined && modalProps.parentId !== undefined) {
      uploadCatalog({ name: data.name, parentId: modalProps.parentId });
      hideModal();
    }
  };

  return (
    <Card className="max-w-md w-full p-2 shadow-lg border dark:bg-neutral-900">
      <CardHeader>
        <h2 className="text-lg font-semibold">Create Catalog</h2>
      </CardHeader>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <CardContent className="space-y-2">
          <Label htmlFor="name">Catalog Name</Label>
          <Input
            autoComplete="off"
            id="name"
            type="text"
            title="nameInput"
            placeholder="Name"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p title="testTitle" className="text-sm text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={uploadCatalogLoading}>
            {uploadCatalogLoading ? "Create..." : "Create"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CatalogUploader;
