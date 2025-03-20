import FileDetails from "@/components/sections/FileSection/FileDetails/FileDetails";
import { useFile } from "@/hooks/use-file";
import { useModal } from "@/hooks/use-modal";
import { UserFile } from "@/lib/types/file";
import { useQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

describe("FileDetails", () => {
  beforeEach(() => {
    (useFile as jest.Mock).mockReturnValue({
      allFiles: [
        {
          id: 5,
          userId: 5,
          name: "test",
          extension: "test",
          type: "FILE",
          size: 255,
          path: "test",
          modifiedAt: new Date(),
          createdAt: new Date(),
          isTrashed: false,
          isHidden: false,
          isFavorite: false,
          parentId: 0,
        },
      ] as UserFile[],
      isLoading: false,
    });
    (useModal as jest.Mock).mockReturnValue({
      modalProps: { fileId: 5 },
    });
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
    });
  });

  it("renders correctly", () => {
    render(<FileDetails />);

    expect(screen.getByTestId("divTest")).toBeInTheDocument();
  });

  it("fileActivityList was shown", () => {
    render(<FileDetails />);

    expect(screen.getByText("No activity found.")).toBeInTheDocument();
  });
});
