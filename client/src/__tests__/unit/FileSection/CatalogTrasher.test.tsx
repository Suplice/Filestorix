import useFileActions from "@/hooks/use-file-actions";
import { useModal } from "@/hooks/use-modal";
import CatalogTrasher from "../../../components/sections/FileSection/CatalogTrasher";
import { render, screen, fireEvent } from "@testing-library/react";

describe("CatalogTrasher Component", () => {
  let mockTrashCatalog: jest.Mock;
  let mockHideModal: jest.Mock;

  beforeEach(() => {
    mockTrashCatalog = jest.fn();
    mockHideModal = jest.fn();

    (useFileActions as jest.Mock).mockReturnValue({
      trashCatalog: mockTrashCatalog,
      trashCatalogLoading: false,
    });

    (useModal as jest.Mock).mockReturnValue({
      hideModal: mockHideModal,
      modalProps: { fileId: 123 },
    });
  });

  it("renders component correctly", () => {
    render(<CatalogTrasher />);

    expect(
      screen.getByText("Are you sure you want to trash this catalog?")
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Trash" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("calls trashCatalog and hides modal on trash", () => {
    render(<CatalogTrasher />);

    fireEvent.click(screen.getByRole("button", { name: "Trash" }));

    expect(mockTrashCatalog).toHaveBeenCalledWith({ fileId: 123 });
    expect(mockHideModal).toHaveBeenCalled();
  });

  it("Disables button when trashing", () => {
    (useFileActions as jest.Mock).mockReturnValue({
      trashCatalog: mockTrashCatalog,
      trashCatalogLoading: true,
    });

    render(<CatalogTrasher />);

    expect(screen.getByRole("button", { name: "Trashing..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });

  test.each([
    [{ fileId: 123 }, 123],
    [{ fileId: undefined }, undefined],
  ])("handles diffrent modalProps: %p", (modalProps, expectedFileId) => {
    (useModal as jest.Mock).mockReturnValue({
      hideModal: mockHideModal,
      modalProps,
    });

    render(<CatalogTrasher />);

    fireEvent.click(screen.getByRole("button", { name: "Trash" }));

    if (expectedFileId) {
      expect(mockTrashCatalog).toHaveBeenCalledWith({ fileId: expectedFileId });
    } else {
      expect(mockTrashCatalog).not.toHaveBeenCalled();
    }
  });
});
