import FileRenamer from "@/components/sections/FileSection/FileRenamer";
import useFileActions from "@/hooks/use-file-actions";
import { useModal } from "@/hooks/use-modal";
import { act, fireEvent, render, screen } from "@testing-library/react";

describe("FileRenamer", () => {
  let mockRenameFile: jest.Mock;
  let mockHideModal: jest.Mock;

  beforeEach(() => {
    mockHideModal = jest.fn();
    mockRenameFile = jest.fn();
    (useModal as jest.Mock).mockReturnValue({
      hideModal: mockHideModal,
      modalProps: { fileId: 123 },
    });
    (useFileActions as jest.Mock).mockReturnValue({
      renameFile: mockRenameFile,
      renameFileLoading: false,
    });
  });

  it("Component renders", () => {
    render(<FileRenamer />);

    expect(screen.getByText(/New File Name/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Rename File" })
    ).toBeInTheDocument();
  });

  it("calls hideModal on Rename", async () => {
    render(<FileRenamer />);

    fireEvent.change(screen.getByPlaceholderText("New Name"), {
      target: { value: "dada" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Rename File" }));
    });

    expect(mockHideModal).toHaveBeenCalledTimes(1);
  });

  test.each([
    [{ fileId: 123 }, true],
    [{ fileId: undefined }, false],
    [{ fileId: null }, false],
  ])("test renameFile for diffrent filesId %p", async (modalProps, result) => {
    (useModal as jest.Mock).mockReturnValue({
      hideModal: mockHideModal,
      modalProps: modalProps,
    });

    render(<FileRenamer />);

    fireEvent.change(screen.getByPlaceholderText("New Name"), {
      target: { value: "dada" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Rename File" }));
    });

    if (result) {
      expect(mockRenameFile).toHaveBeenCalledWith({
        fileId: modalProps.fileId,
        name: "dada",
      });
    } else {
      expect(mockRenameFile).not.toHaveBeenCalledWith();
    }
  });

  test.each([
    ["d", false],
    ["dada", true],
    ["da", true],
  ])("test renameFile with diffrent names", async (value, result) => {
    render(<FileRenamer />);

    fireEvent.change(screen.getByPlaceholderText("New Name"), {
      target: { value: value },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Rename File" }));
    });

    if (result) {
      expect(mockRenameFile).toHaveBeenCalledWith({
        fileId: 123,
        name: value,
      });
    } else {
      expect(mockRenameFile).not.toHaveBeenCalledWith();
    }
  });
});
