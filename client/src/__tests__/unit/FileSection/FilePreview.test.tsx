import { render, screen, fireEvent } from "@testing-library/react";
import { useModal } from "@/hooks/use-modal";
import FilePreview from "@/components/sections/FileSection/FilePreview";
import { useQuery } from "@tanstack/react-query";

jest.mock("lucide-react", () => ({
  FileX2Icon: () => <svg data-testid="mock-file-icon" />,
}));

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mock-preview-url");
  global.URL.revokeObjectURL = jest.fn();
});

describe("FilePreview", () => {
  beforeEach(() => {
    (useModal as jest.Mock).mockReturnValue({
      modalProps: { fileName: "test-file", fileId: 1 },
    });

    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: null,
      error: null,
      refetch: jest.fn(),
    });
  });

  it("renders loading spinner when data is loading", () => {
    (useQuery as jest.Mock).mockReturnValueOnce({
      isLoading: true,
    });

    render(<FilePreview />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders an error message when the request fails", () => {
    const mockRefetch = jest.fn();
    (useQuery as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      error: new Error("Network error"),
      refetch: mockRefetch,
    });

    render(<FilePreview />);
    expect(
      screen.getByText("An error occurred, please try again.")
    ).toBeInTheDocument();

    const retryButton = screen.getByText("Retry");
    fireEvent.click(retryButton);
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("renders a message when no preview is available", () => {
    render(<FilePreview />);
    expect(
      screen.getByText("File preview is not available.")
    ).toBeInTheDocument();
  });

  it("renders an image preview when file type is an image", () => {
    (useQuery as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      data: new Blob([], { type: "image/png" }),
    });

    render(<FilePreview />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders a PDF preview when file type is a PDF", () => {
    (useQuery as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      data: new Blob([], { type: "application/pdf" }),
    });

    render(<FilePreview />);
    expect(screen.getByTitle("PDF Preview")).toBeInTheDocument();
  });

  it("renders a text file preview", () => {
    (useQuery as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      data: new Blob([], { type: "text/plain" }),
    });

    render(<FilePreview />);
    expect(screen.getByTitle("File Preview")).toBeInTheDocument();
  });

  it("renders a download link when a file is available", () => {
    (useQuery as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      data: new Blob([], { type: "image/png" }),
    });

    render(<FilePreview />);
    expect(screen.getByText("Download File")).toBeInTheDocument();
  });
});
