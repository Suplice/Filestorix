"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFile } from "@/hooks/use-file";
import { useModal } from "@/hooks/use-modal";
import { renameFileSchema } from "@/lib/schemas/fileRelatedSchemas";
import { RenameFileForm } from "@/lib/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const FileRenamer = () => {
  const { renameFile } = useFile();

  const { hideModal, modalProps } = useModal();

  const form = useForm<RenameFileForm>({
    resolver: zodResolver(renameFileSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = (data: RenameFileForm) => {
    renameFile({ name: data.name, fileId: modalProps!.fileId! });
    hideModal();
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-6 items-center justify-center"
    >
      <div className="p-4 border rounded-md w-full h-full dark:bg-neutral-900 bg-accent transition-all max-h-96 overflow-auto flex  gap-2 flex-col ">
        <Label>New File Name</Label>
        <Input
          type="text"
          className="outline-none"
          {...form.register("name")}
        ></Input>
        <p className="text-red-500">{form.formState.errors.name?.message}</p>
      </div>

      <Button type="submit"> Rename File </Button>
    </form>
  );
};

export default FileRenamer;
