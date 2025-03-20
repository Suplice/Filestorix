import FileRestore from "@/components/sections/FileSection/FileRestore";
import useFileActions from "@/hooks/use-file-actions";
import { useModal } from "@/hooks/use-modal";
import { fireEvent, render, screen } from "@testing-library/react";

describe("FileRestore", () => {
  let mockRestoreFile: jest.Mock;
  let mockHideModal: jest.Mock;

  beforeEach(() => {
    mockHideModal = jest.fn();
    mockRestoreFile = jest.fn();
    (useModal as jest.Mock).mockReturnValue({
      hideModal: mockHideModal,
      modalProps: { fileId: 123, parentId: 32 },
    });
    (useFileActions as jest.Mock).mockReturnValue({
      restoreFile: mockRestoreFile,
      restoreFileLoading: false,
    });
  });

  it("Component renders", () => {
    render(<FileRestore />);

    expect(
      screen.getByText(/Are you sure you want to restore this file?/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Restore" })).toBeInTheDocument();
  });

  it("calls hideModal on restore", () => {
    render(<FileRestore />);

    fireEvent.click(screen.getByRole("button", { name: "Restore" }));

    expect(mockHideModal).toHaveBeenCalledTimes(1);
  });

  test.each([
    [{ fileId: 123, parentId: 23 }, true],
    [{ fileId: undefined, parentId: 3 }, false],
    [{ fileId: null, parentId: 12 }, false],
    [{ fileId: 23, parentId: null }, false],
    [{ fileId: 1, parentId: undefined }, false],
    [{ fileId: null, parentId: undefined }, false],
  ])("test renameFile for diffrent filesId %p", (modalProps, result) => {
    (useModal as jest.Mock).mockReturnValue({
      hideModal: mockHideModal,
      modalProps: modalProps,
    });

    render(<FileRestore />);

    fireEvent.click(screen.getByRole("button", { name: "Restore" }));

    if (result) {
      expect(mockRestoreFile).toHaveBeenCalledWith({
        fileId: modalProps.fileId,
        parentId: modalProps.parentId,
      });
    } else {
      expect(mockRestoreFile).not.toHaveBeenCalled();
    }
  });
});
