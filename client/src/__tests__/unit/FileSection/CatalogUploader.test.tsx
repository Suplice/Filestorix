import useFileActions from "@/hooks/use-file-actions";
import { useModal } from "@/hooks/use-modal";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CatalogUploader from "@/components/sections/FileSection/CatalogUploader";

describe("CatalogUploader Component", () => {
  let mockUploadCatalog: jest.Mock;
  let mockHideModal: jest.Mock;

  beforeEach(() => {
    mockUploadCatalog = jest.fn();
    mockHideModal = jest.fn();

    (useFileActions as jest.Mock).mockReturnValue({
      uploadCatalog: mockUploadCatalog,
      uploadCatalogLoading: false,
    });

    (useModal as jest.Mock).mockReturnValue({
      hideModal: mockHideModal,
      modalProps: { parentId: 123 },
    });
  });

  it("renders component correctly", () => {
    render(<CatalogUploader />);

    expect(screen.getByText("Create Catalog")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("calls uploadCatalog and hides modal on trash", async () => {
    render(<CatalogUploader />);

    fireEvent.change(screen.getByPlaceholderText(/Name/i), {
      target: { value: "newName" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Create" }));
    });

    expect(mockUploadCatalog).toHaveBeenCalledWith({
      name: "newName",
      parentId: 123,
    });
    expect(mockHideModal).toHaveBeenCalled();
  });

  test.each([
    ["a", false],
    ["ada", true],
    ["test", true],
    ["d", false],
  ])("handle diffrent folder name lengths %p", async (value, result) => {
    render(<CatalogUploader />);

    fireEvent.change(screen.getByPlaceholderText(/Name/i), {
      target: { value: value },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Create" }));
    });

    if (result) {
      expect(mockUploadCatalog).toHaveBeenCalledWith({
        name: value,
        parentId: 123,
      });

      expect(mockHideModal).toHaveBeenCalled();
    } else {
      expect(screen.getByRole("paragraph")).toBeInTheDocument();
    }
  });

  test.each([
    [{ parentId: undefined }, "test", undefined],
    [{ parentId: 100 }, "test", 100],
  ])(
    "handles diffrent modalProps %p: ",
    async (modalProps, name, supposedResult) => {
      (useModal as jest.Mock).mockReturnValue({
        hideModal: mockHideModal,
        modalProps,
      });

      render(<CatalogUploader />);

      fireEvent.change(screen.getByPlaceholderText(/Name/i), {
        target: { value: name },
      });

      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Create" }));
      });

      if (supposedResult) {
        expect(mockUploadCatalog).toHaveBeenCalledWith({
          name: name,
          parentId: modalProps.parentId,
        });
        expect(mockHideModal).toHaveBeenCalled();
      } else {
        expect(mockUploadCatalog).not.toHaveBeenCalled();
      }
    }
  );
});
