import FileRemover from "@/components/sections/FileSection/FileRemover";
import useFileActions from "@/hooks/use-file-actions";
import { useModal } from "@/hooks/use-modal";
import { fireEvent, render, screen } from "@testing-library/react";

describe("FileRemover", () => {
  let mockRemoveFile: jest.Mock;
  let mockHideModal: jest.Mock;

  beforeEach(() => {
    mockRemoveFile = jest.fn();
    mockHideModal = jest.fn();

    (useModal as jest.Mock).mockReturnValue({
      hideModal: mockHideModal,
      modalProps: { fileId: 123 },
    });

    (useFileActions as jest.Mock).mockReturnValue({
      removeFile: mockRemoveFile,
      removeFileLoading: false,
    });
  });

  it("Component renders correctly", () => {
    render(<FileRemover />);

    expect(
      screen.getByText("Are you sure you want to Delete this file?")
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("calls hideModal on restore", () => {
    render(<FileRemover />);

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(mockHideModal).toHaveBeenCalledTimes(1);
  });

  test.each([
    [{ fileId: 123 }, true],
    [{ fileId: undefined }, false],
    [{ fileId: null }, false],
  ])("test removeFile for diffrent fileId values %p", (modalProps, result) => {
    (useModal as jest.Mock).mockReturnValue({
      hideModal: mockHideModal,
      modalProps: modalProps,
    });

    render(<FileRemover />);

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    if (result) {
      expect(mockRemoveFile).toHaveBeenCalledWith({
        fileId: modalProps.fileId,
      });
      expect(mockHideModal).toHaveBeenCalledTimes(1);
    } else {
      expect(mockRemoveFile).not.toHaveBeenCalledWith({
        fileId: modalProps.fileId,
      });
      expect(mockHideModal).not.toHaveBeenCalledTimes(1);
    }
  });
});
