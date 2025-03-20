import { render, screen, fireEvent } from "@testing-library/react";
import useFileActions from "@/hooks/use-file-actions";
import { useModal } from "@/hooks/use-modal";
import CatalogRemover from "../../../components/sections/FileSection/CatalogRemover";



describe("CatalogRemover Component", () => {
  let mockDeleteCatalog: jest.Mock;
  let mockHideModal: jest.Mock;

  beforeEach(() => {
    mockDeleteCatalog = jest.fn();
    mockHideModal = jest.fn();

    (useFileActions as jest.Mock).mockReturnValue({
      deleteCatalog: mockDeleteCatalog,
      deleteCatalogLoading: false,
    });

    (useModal as jest.Mock).mockReturnValue({
      hideModal: mockHideModal,
      modalProps: { fileId: 123 },
    });
  });

  it("renders component correctly", () => {
    render(<CatalogRemover />);

    expect(
      screen.getByText("Are you sure you want to Delete this catalog?")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("calls deleteCatalog and hides modal on remove", () => {
    render(<CatalogRemover />);

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(mockDeleteCatalog).toHaveBeenCalledWith({ fileId: 123 });
    expect(mockHideModal).toHaveBeenCalled();
  });

  it("calls hideModal on cancel", () => {
    render(<CatalogRemover />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockHideModal).toHaveBeenCalled();
  });

  it("disables buttons when deleting", () => {
    (useFileActions as jest.Mock).mockReturnValue({
      deleteCatalog: mockDeleteCatalog,
      deleteCatalogLoading: true,
    });

    render(<CatalogRemover />);

    expect(screen.getByRole("button", { name: "Removing..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });

  test.each([
    [{ fileId: 123 }, 123],
    [{ fileId: undefined }, undefined],
  ])("handles different modalProps: %p", (modalProps, expectedFileId) => {
    (useModal as jest.Mock).mockReturnValue({
      hideModal: mockHideModal,
      modalProps,
    });

    render(<CatalogRemover />);

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    if (expectedFileId) {
      expect(mockDeleteCatalog).toHaveBeenCalledWith({
        fileId: expectedFileId,
      });
    } else {
      expect(mockDeleteCatalog).not.toHaveBeenCalled();
    }
  });
});
