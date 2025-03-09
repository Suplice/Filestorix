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
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useFile } from "@/hooks/use-file";
import { FileIcon } from "lucide-react";

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const { files } = useFile();

  // Obsługa skrótu ⌘J lub Ctrl+J
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <div
        className="w-full max-w-sm cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Press to search</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>J
          </kbd>
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
                className="cursor-pointer flex items-center gap-2"
              >
                <FileIcon className="w-4 h-4" />
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
