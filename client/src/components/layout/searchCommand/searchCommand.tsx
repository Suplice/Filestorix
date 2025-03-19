"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useFile } from "@/hooks/use-file";
import { useModal } from "@/hooks/use-modal";
import { DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import useSettings from "@/hooks/use-settings";
import FileIcon from "@/components/sections/FileSection/FileList/FileIcon";

export function SearchCommand() {
  const { files } = useFile();
  const { showModal } = useModal();
  const [open, setOpen] = useState(false);
  const { settings, isPending } = useSettings();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key === settings.shortcuts.openSearchBox &&
        (e.metaKey || e.ctrlKey)
      ) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [settings.shortcuts.openSearchBox]);

  return (
    <>
      <div
        className="w-full max-w-sm cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Press to search</span>
          {!isPending && (
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>
              {settings.shortcuts.openSearchBox}
            </kbd>
          )}
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle asChild>
          <VisuallyHidden>Search files</VisuallyHidden>
        </DialogTitle>

        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {files.map((file) => (
              <CommandItem
                key={file.id}
                data-id={file.id}
                data-name={file.name}
                className="cursor-pointer flex items-center gap-2"
                onSelect={() => {
                  setOpen(false);
                  showModal("FilePreview", {
                    fileName: file.id + file.extension,
                  });
                }}
              >
                <FileIcon extension={file.extension} />
                <span>{file.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default SearchCommand;
