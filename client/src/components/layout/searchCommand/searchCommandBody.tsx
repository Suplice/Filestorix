import FileIcon from "@/components/sections/FileSection/FileCard/FileIcon";
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
import { UserFile } from "@/lib/types/file";
import { setParentId, setRoute } from "@/store/locationSlice";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const SearchCommandBody = () => {
  const dispatch = useDispatch();
  const { showModal, isOpen, hideModal } = useModal();
  const { nonCatalogFiles, catalogFiles } = useFile();
  const router = useRouter();

  const handleOpenChange = (state: boolean) => {
    if (state) {
      showModal("SearchBox", {});
    } else {
      hideModal();
    }
  };

  const handleSelectFolder = (file: UserFile) => {
    router.push("/drive");
    dispatch(
      setRoute({
        route: [
          { sectionName: "Home", catalogId: null },
          { sectionName: file.name, catalogId: file.id },
        ],
      })
    );

    dispatch(setParentId({ parentId: file.id }));
    hideModal();
  };

  const handleSelectFile = (file: UserFile) => {
    hideModal();
    showModal("FilePreview", {
      fileName: file.id + file.extension,
    });
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTitle asChild>
        <VisuallyHidden>Search files</VisuallyHidden>
      </DialogTitle>

      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Catalogs">
          {catalogFiles.map((file) => (
            <CommandItem
              key={file.id}
              data-id={file.id}
              data-name={file.name}
              className="cursor-pointer flex items-center gap-2"
              onSelect={() => handleSelectFolder(file)}
            >
              <FileIcon extension={file.extension} />
              <span>{file.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Files">
          {nonCatalogFiles.map((file) => (
            <CommandItem
              key={file.id}
              data-id={file.id}
              data-name={file.name}
              className="cursor-pointer flex items-center gap-2"
              onSelect={() => handleSelectFile(file)}
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
