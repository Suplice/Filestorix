import { render, screen } from "@testing-library/react";
import { useFilePreviews } from "@/hooks/use-file-previews";
import { UserFile } from "@/lib/types/file";
import FileMainGallery from "@/components/sections/FileSection/FileMainGallery/FileMainGallery";
import { useModal } from "@/hooks/use-modal";

jest.mock("lucide-react", () => ({
  ArrowLeft: () => <svg data-testid="mock-arrow-left" />,
  ArrowRight: () => <svg data-testid="mock-arrow-right" />,
  FileIcon: () => <svg data-testid="mock-file-icon" />,
}));

describe("FileMainGallery", () => {
  let mockFiles: UserFile[];
  let mockPreviews: Record<string, string>;
  let mockShowModal: jest.Mock;

  beforeEach(() => {
    mockShowModal = jest.fn();

    mockFiles = [
      {
        id: 1,
        name: "file1.png",
        size: 12345,
        type: "FILE",
        userId: 0,
        extension: "",
        path: "",
        modifiedAt: new Date(),
        createdAt: new Date(),
        isTrashed: false,
        isFavorite: false,
        parentId: 0,
        isHidden: false,
      },
      {
        id: 2,
        name: "file2.jpg",
        size: 67890,
        type: "FILE",
        userId: 0,
        extension: "",
        path: "",
        modifiedAt: new Date(),
        createdAt: new Date(),
        isTrashed: false,
        isFavorite: false,
        parentId: 0,
        isHidden: false,
      },
    ];

    mockPreviews = {
      "1": "mock-preview-url-1",
      "2": "mock-preview-url-2",
    };

    (useFilePreviews as jest.Mock).mockReturnValue(mockPreviews);
    (useModal as jest.Mock).mockReturnValue({
      showModal: mockShowModal,
    });
  });

  it("renders the gallery with provided files", () => {
    render(<FileMainGallery files={mockFiles} />);

    expect(screen.getByTestId("mock-arrow-left")).toBeInTheDocument();
    expect(screen.getByTestId("mock-arrow-right")).toBeInTheDocument();

    mockFiles.forEach((file) => {
      expect(screen.getByText(file.name)).toBeInTheDocument();
    });
  });

  it("disables previous button initially", () => {
    render(<FileMainGallery files={mockFiles} />);
    expect(screen.getByTestId("leftButtonTest")).toBeDisabled();
  });
});
