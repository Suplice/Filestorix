import FileIcon from "@/components/sections/FileSection/FileList/FileIcon";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { useFile } from "@/hooks/use-file";
import { useModal } from "@/hooks/use-modal";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const SearchCommandBody = () => {
  const { showModal, isOpen, hideModal } = useModal();
  const { nonCatalogFiles } = useFile();

  const handleOpenChange = (state: boolean) => {
    if (state) {
      showModal("SearchBox", {});
    } else {
      hideModal();
    }
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTitle asChild>
        <VisuallyHidden>Search files</VisuallyHidden>
      </DialogTitle>

      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {nonCatalogFiles.map((file) => (
            <CommandItem
              key={file.id}
              data-id={file.id}
              data-name={file.name}
              className="cursor-pointer flex items-center gap-2"
              onSelect={() => {
                hideModal();
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
  );
};

export default SearchCommandBody;
