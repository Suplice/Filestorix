import FileUploader from "@/components/sections/FileSection/FileUploader";
import useFileActions from "@/hooks/use-file-actions";
import { useModal } from "@/hooks/use-modal";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

jest.mock("lucide-react", () => ({
  X: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="mock-file-icon" {...props} />
  ),
}));

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mock-preview-url");
  global.URL.revokeObjectURL = jest.fn();
});

describe("FileUploader", () => {
  let mockUploadFiles: jest.Mock;
  let mockHideModal: jest.Mock;

  beforeEach(() => {
    mockUploadFiles = jest.fn();
    mockHideModal = jest.fn();

    (useFileActions as jest.Mock).mockReturnValue({
      uploadFiles: mockUploadFiles,
    });

    (useModal as jest.Mock).mockReturnValue({
      hideModal: mockHideModal,
      modalProps: { parentId: 123 },
    });
  });

  it("renders correctly", () => {
    render(<FileUploader />);
    expect(
      screen.getByText("Drag & drop files here, or click to select files")
    ).toBeInTheDocument();
  });

  it("adds a file to the list when dropped", async () => {
    const file = new File(["file-content"], "test-file.png", {
      type: "image/png",
    });

    render(<FileUploader />);
    const input = screen.getByTestId("inputTest");

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("test-file.png")).toBeInTheDocument();
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        "mock-preview-url"
      );
    });
  });

  it("removes a file from the list when delete icon is clicked", async () => {
    const file = new File(["file-content"], "test-file.png", {
      type: "image/png",
    });

    render(<FileUploader />);
    const input = screen.getByTestId("inputTest");
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("test-file.png")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId("mock-file-icon");

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(screen.queryByText("test-file.png")).not.toBeInTheDocument();
    });
  });

  it("uploads files when the upload button is clicked", async () => {
    const file = new File(["file-content"], "test-file.png", {
      type: "image/png",
    });

    render(<FileUploader />);
    const input = screen.getByTestId("inputTest");
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("test-file.png")).toBeInTheDocument();
    });

    const uploadButton = screen.getByText("Upload");
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockUploadFiles).toHaveBeenCalledWith({
        files: [file],
        parentId: 123,
      });
      expect(mockHideModal).toHaveBeenCalled();
    });
  });
});
