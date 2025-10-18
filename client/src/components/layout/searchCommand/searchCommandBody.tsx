"use client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const SearchCommandBody = () => {
  const { showModal, isOpen, hideModal } = useModal();

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
        <CommandGroup heading="Catalogs"></CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommandBody;
