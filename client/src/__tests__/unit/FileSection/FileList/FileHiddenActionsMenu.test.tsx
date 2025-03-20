import { render, screen, fireEvent } from "@testing-library/react";
import { useModal } from "@/hooks/use-modal";
import useFileActions from "@/hooks/use-file-actions";
import FileHiddenActionsMenu from "@/components/sections/FileSection/FileList/FileHiddenActionsMenu";
import { UserFile } from "@/lib/types/file";

jest.mock("lucide-react", () => ({
  Eye: () => <svg data-testid="eye-icon" />,
  EyeOff: () => <svg data-testid="eye-off-icon" />,
  PenLine: () => <svg data-testid="pen-line-icon" />,
  Star: () => <svg data-testid="star-icon" />,
  StarOff: () => <svg data-testid="star-off-icon" />,
}));

jest.mock("@/hooks/use-modal", () => ({
  useModal: jest.fn(),
}));

jest.mock("@/hooks/use-file-actions", () => jest.fn());

describe("FileHiddenActionsMenu", () => {
  const mockShowModal = jest.fn();
  const mockAddFavoriteFile = jest.fn();
  const mockRemoveFavoriteFile = jest.fn();
  const mockHideFile = jest.fn();
  const mockRevealFile = jest.fn();

  beforeEach(() => {
    (useModal as jest.Mock).mockReturnValue({ showModal: mockShowModal });

    (useFileActions as jest.Mock).mockReturnValue({
      addFavoriteFile: mockAddFavoriteFile,
      removeFavoriteFile: mockRemoveFavoriteFile,
      hideFile: mockHideFile,
      revealFile: mockRevealFile,
    });
  });

  const renderComponent = (
    fileProps: Partial<UserFile>,
    isHidden: boolean = false
  ) => {
    const file: UserFile = {
      id: 1,
      name: "Test File",
      type: "FILE",
      isTrashed: false,
      isFavorite: fileProps.isFavorite || false,
      isHidden: fileProps.isHidden || false,
      parentId: 0,
      userId: 0,
      extension: "",
      size: 0,
      path: "",
      modifiedAt: new Date(),
      createdAt: new Date(),
    };

    render(<FileHiddenActionsMenu file={file} isHidden={isHidden} />);
  };

  it("renders hidden actions when isHidden is true", () => {
    renderComponent({}, true);
    expect(screen.getByTestId("pen-line-icon")).toBeInTheDocument();
    expect(screen.getByTestId("star-icon")).toBeInTheDocument();
    expect(screen.getByTestId("eye-off-icon")).toBeInTheDocument();
  });

  it("opens rename modal when clicking rename icon", () => {
    renderComponent({});

    fireEvent.click(screen.getByTestId("pen-line-icon"));

    expect(mockShowModal).toHaveBeenCalledWith("FileNameChanger", {
      fileId: 1,
    });
  });

  it("calls addFavoriteFile when marking as favorite", () => {
    renderComponent({ isFavorite: false });

    fireEvent.click(screen.getByTestId("star-icon"));

    expect(mockAddFavoriteFile).toHaveBeenCalledWith({ fileId: 1 });
  });

  it("calls removeFavoriteFile when unfavoriting", () => {
    renderComponent({ isFavorite: true });

    fireEvent.click(screen.getByTestId("star-off-icon"));

    expect(mockRemoveFavoriteFile).toHaveBeenCalledWith({ fileId: 1 });
  });

  it("calls revealFile when revealing", () => {
    renderComponent({ isHidden: true });

    fireEvent.click(screen.getByTestId("eye-icon"));

    expect(mockRevealFile).toHaveBeenCalledWith({ fileId: 1 });
  });

  it("calls hideFile when hiding", () => {
    renderComponent({ isHidden: false });

    fireEvent.click(screen.getByTestId("eye-off-icon"));

    expect(mockHideFile).toHaveBeenCalledWith({ fileId: 1 });
  });
});
