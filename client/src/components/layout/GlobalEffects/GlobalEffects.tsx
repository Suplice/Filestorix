import { useEffect, useState } from "react";
import useSettings from "@/hooks/use-settings";
import { useModal } from "@/hooks/use-modal";

const GlobalShortcuts = () => {
  const { settings, toggleHidden } = useSettings();
  const { showModal, hideModal, isOpen, modalType } = useModal();

  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        console.log("test", isAvailable);
        e.preventDefault();
        if (isAvailable) {
          switch (e.key) {
            case settings.shortcuts.openSearchBox: {
              setIsAvailable(false);
              if (isOpen && modalType === "SearchBox") {
                hideModal();
              } else {
                showModal("SearchBox", {});
              }
              break;
            }
            case settings.shortcuts.toggleHiddenFiles: {
              setIsAvailable(false);
              toggleHidden({ state: !settings.generalOptions.showHiddenFiles });
              break;
            }
          }
        }
      }
    };

    const up = (e: KeyboardEvent) => {
      if (
        e.key === settings.shortcuts.openSearchBox ||
        e.key === settings.shortcuts.toggleHiddenFiles
      )
        setIsAvailable(true);
    };

    document.addEventListener("keydown", down);
    document.addEventListener("keyup", up);

    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("keyup", up);
    };
  }, [
    settings,
    isOpen,
    modalType,
    showModal,
    hideModal,
    toggleHidden,
    isAvailable,
  ]);

  return null;
};

export default GlobalShortcuts;
