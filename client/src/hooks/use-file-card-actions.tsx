import { useState } from "react";

const useFileCardActions = () => {
  const [isHiddenActionsMenuVisible, setIsHiddenActionsMenuVisible] =
    useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMouseEnter = () => setIsHiddenActionsMenuVisible(true);
  const handleMouseLeave = () => setIsHiddenActionsMenuVisible(false);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(true);
  };

  return {
    isHiddenActionsMenuVisible,
    isMenuOpen,
    setIsHiddenActionsMenuVisible,
    setIsMenuOpen,
    handleMouseEnter,
    handleMouseLeave,
    handleContextMenu,
  };
};

export default useFileCardActions;
