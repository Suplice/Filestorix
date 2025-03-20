import FileTrasher from "@/components/sections/FileSection/FileTrasher";
import useFileActions from "@/hooks/use-file-actions";
import { useModal } from "@/hooks/use-modal";
import { fireEvent, render, screen } from "@testing-library/react";

describe("FileRestore", () => {
  let mockTrashFile: jest.Mock;
  let mockHideModal: jest.Mock;

  beforeEach(() => {
    mockHideModal = jest.fn();
    mockTrashFile = jest.fn();
    (useModal as jest.Mock).mockReturnValue({
      hideModal: mockHideModal,
      modalProps: { fileId: 123 },
    });
    (useFileActions as jest.Mock).mockReturnValue({
      trashFile: mockTrashFile,
      trashFileLoading: false,
    });
  });

  it("Component renders", () => {
    render(<FileTrasher />);

    expect(
      screen.getByText(/Are you sure you want to trash this file?/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Trash" })).toBeInTheDocument();
  });

  it("calls hideModal on restore", () => {
    render(<FileTrasher />);

    fireEvent.click(screen.getByRole("button", { name: "Trash" }));

    expect(mockHideModal).toHaveBeenCalledTimes(1);
  });

  test.each([
    [{ fileId: 123 }, true],
    [{ fileId: undefined }, false],
    [{ fileId: null }, false],
  ])("test renameFile for diffrent filesId %p", (modalProps, result) => {
    (useModal as jest.Mock).mockReturnValue({
      hideModal: mockHideModal,
      modalProps: modalProps,
    });

    render(<FileTrasher />);

    fireEvent.click(screen.getByRole("button", { name: "Trash" }));

    if (result) {
      expect(mockTrashFile).toHaveBeenCalledWith({
        fileId: modalProps.fileId,
      });
    } else {
      expect(mockTrashFile).not.toHaveBeenCalled();
    }
  });
});
