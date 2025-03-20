import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useModal } from "@/hooks/use-modal";
import useFileActions from "@/hooks/use-file-actions";
import userEvent from "@testing-library/user-event";
import FileActionsMenu from "@/components/sections/FileSection/FileList/FileActionsMenu";
import { UserFile } from "@/lib/types/file";

jest.mock("lucide-react", () => ({
  ArchiveRestore: () => <svg data-testid="archive-restore-icon" />,
  ArrowUpLeft: () => <svg data-testid="arrow-up-left-icon" />,
  Delete: () => <svg data-testid="delete-icon" />,
  Eye: () => <svg data-testid="eye-icon" />,
  EyeOff: () => <svg data-testid="eye-off-icon" />,
  FolderOpen: () => <svg data-testid="folder-open-icon" />,
  Info: () => <svg data-testid="info-icon" />,
  MoreVertical: () => <svg data-testid="more-vertical-icon" />,
  PenLine: () => <svg data-testid="pen-line-icon" />,
  Star: () => <svg data-testid="star-icon" />,
  StarOff: () => <svg data-testid="star-off-icon" />,
  Trash: () => <svg data-testid="trash-icon" />,
}));

jest.mock("@/hooks/use-modal", () => ({
  useModal: jest.fn(),
}));

jest.mock("@/hooks/use-file-actions", () => jest.fn());

describe("FileActionsMenu", () => {
  const mockShowModal = jest.fn();
  const mockHandleClick = jest.fn();
  const mockHandleFileClick = jest.fn();

  beforeEach(() => {
    (useModal as jest.Mock).mockReturnValue({ showModal: mockShowModal });

    (useFileActions as jest.Mock).mockReturnValue({
      addFavoriteFile: jest.fn(),
      removeFavoriteFile: jest.fn(),
      hideFile: jest.fn(),
      revealFile: jest.fn(),
    });
  });

  const renderComponent = (fileProps: Partial<UserFile> = {}) => {
    const file: UserFile = {
      id: 1,
      name: "Test File",
      type: fileProps.type || "FILE",
      isTrashed: fileProps.isTrashed || false,
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

    render(
      <FileActionsMenu
        file={file}
        handleClick={mockHandleClick}
        handleFileClick={mockHandleFileClick}
      />
    );
  };

  it("renders the menu trigger button", () => {
    renderComponent();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("opens the menu on button click", async () => {
    renderComponent();

    const button = screen.getByRole("button");
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Open")).toBeInTheDocument();
    });
  });

  it("calls handleClick for catalogs", async () => {
    renderComponent({ type: "CATALOG" });

    const button = screen.getByRole("button");
    await userEvent.click(button);
    fireEvent.click(screen.getByText("Open"));

    expect(mockHandleClick).toHaveBeenCalledWith(1, "Test File");
  });

  it("calls handleFileClick for files", async () => {
    renderComponent();

    const button = screen.getByRole("button");
    await userEvent.click(button);
    fireEvent.click(screen.getByText("Open"));

    expect(mockHandleFileClick).toHaveBeenCalled();
  });

  it("shows the rename modal when clicking rename", async () => {
    renderComponent();

    const button = screen.getByRole("button");
    await userEvent.click(button);
    fireEvent.click(screen.getByText("Rename"));

    expect(mockShowModal).toHaveBeenCalledWith("FileNameChanger", {
      fileId: 1,
    });
  });

  it("shows the delete/trash modal correctly", async () => {
    renderComponent();

    const button = screen.getByRole("button");
    await userEvent.click(button);
    fireEvent.click(screen.getByText("Trash"));

    expect(mockShowModal).toHaveBeenCalledWith("FileTrasher", { fileId: 1 });
  });

  it("shows the restore modal for trashed files", async () => {
    renderComponent({ isTrashed: true });

    const button = screen.getByRole("button");
    await userEvent.click(button);
    fireEvent.click(screen.getByText("Restore"));

    expect(mockShowModal).toHaveBeenCalledWith("FileRestorer", {
      fileId: 1,
      parentId: 0,
    });
  });

  it("calls addFavoriteFile when marking as favorite", async () => {
    const { addFavoriteFile } = useFileActions();

    renderComponent();

    const button = screen.getByRole("button");
    await userEvent.click(button);
    fireEvent.click(screen.getByText("Favorite"));

    expect(addFavoriteFile).toHaveBeenCalledWith({ fileId: 1 });
  });

  it("calls removeFavoriteFile when unfavoriting", async () => {
    const { removeFavoriteFile } = useFileActions();

    renderComponent({ isFavorite: true });

    const button = screen.getByRole("button");
    await userEvent.click(button);
    fireEvent.click(screen.getByText("Unfavorite"));

    expect(removeFavoriteFile).toHaveBeenCalledWith({ fileId: 1 });
  });

  it("calls hideFile when hiding", async () => {
    const { hideFile } = useFileActions();

    renderComponent();

    const button = screen.getByRole("button");
    await userEvent.click(button);
    fireEvent.click(screen.getByText("Hide"));

    expect(hideFile).toHaveBeenCalledWith({ fileId: 1 });
  });

  it("calls revealFile when revealing", async () => {
    const { revealFile } = useFileActions();

    renderComponent({ isHidden: true });

    const button = screen.getByRole("button");
    await userEvent.click(button);
    fireEvent.click(screen.getByText("Reveal"));

    expect(revealFile).toHaveBeenCalledWith({ fileId: 1 });
  });

  it("shows the details modal", async () => {
    renderComponent();

    const button = screen.getByRole("button");
    await userEvent.click(button);
    fireEvent.click(screen.getByText("Details"));

    expect(mockShowModal).toHaveBeenCalledWith("Details", { fileId: 1 });
  });
});
