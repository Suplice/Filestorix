import useFileActions from "@/hooks/use-file-actions";
import { useModal } from "@/hooks/use-modal";
import CatalogTrasher from "../../../components/sections/FileSection/CatalogTrasher";
import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("@/hooks/use-file-actions");
jest.mock("@/hooks/use-modal");

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
});
