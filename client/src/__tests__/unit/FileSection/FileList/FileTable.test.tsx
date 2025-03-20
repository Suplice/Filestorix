import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FileTable from "@/components/sections/FileSection/FileList/FileTable";
import { UserFile } from "@/lib/types/file";
import { useModal } from "@/hooks/use-modal";

jest.mock("@/components/sections/FileSection/FileList/FileRouteManager", () => {
  return function MockFileRouteManager() {
    return <div data-testid="file-route-manager" />;
  };
});

jest.mock("@/components/sections/FileSection/FileList/CreateButton", () => {
  return function MockCreateButton() {
    return <button data-testid="create-button">Mocked Button</button>;
  };
});

jest.mock(
  "@/components/sections/FileSection/FileMainGallery/FileMainGallery",
  () => {
    return function MockFileMainGallery() {
      return <div data-testid="file-main-gallery" />;
    };
  }
);

jest.mock("@/components/sections/FileSection/FileList/FileCard", () => {
  return function MockFileCard(props: { file: { name: string } }) {
    return <div data-testid="file-card">{props.file.name}</div>;
  };
});

jest.mock(
  "@/components/sections/FileSection/FileList/FileTableSkeleton",
  () => {
    return function MockFileTableSkeleton() {
      return <div data-testid="file-table-skeleton" />;
    };
  }
);

describe("FileTable", () => {
  beforeEach(() => {
    (useModal as jest.Mock).mockReturnValue({
      useModal: jest.fn(),
    });
  });

  const files: UserFile[] = [
    {
      id: 1,
      name: "File 1",
      type: "FILE",
      isTrashed: false,
      isFavorite: false,
      isHidden: false,
      parentId: null,
      userId: 0,
      extension: "txt",
      size: 1024,
      path: "",
      modifiedAt: new Date(),
      createdAt: new Date(),
    },
    {
      id: 2,
      name: "Folder 1",
      type: "CATALOG",
      isTrashed: false,
      isFavorite: false,
      isHidden: false,
      parentId: null,
      userId: 0,
      extension: "",
      size: 0,
      path: "",
      modifiedAt: new Date(),
      createdAt: new Date(),
    },
  ];

  it("renders FileTable with files", async () => {
    await waitFor(() => {
      render(
        <FileTable
          files={files}
          isLoading={false}
          section="Main"
          allowCatalogs={true}
        />
      );
    });

    expect(screen.getByTestId("file-route-manager")).toBeInTheDocument();
    expect(screen.getByTestId("create-button")).toBeInTheDocument();
    expect(screen.getAllByTestId("file-card").length).toBe(2);
  });

  it("shows skeleton while loading", () => {
    render(
      <FileTable
        files={[]}
        isLoading={true}
        section="Main"
        allowCatalogs={true}
      />
    );
    expect(screen.getByTestId("file-table-skeleton")).toBeInTheDocument();
  });

  it("displays 'No files found' when there are no files", () => {
    render(
      <FileTable
        files={[]}
        isLoading={false}
        section="Main"
        allowCatalogs={true}
      />
    );
    expect(screen.getByText("No files found")).toBeInTheDocument();
  });

  it("handles folder click and updates route", () => {
    render(
      <FileTable
        files={files}
        isLoading={false}
        section="Main"
        allowCatalogs={true}
      />
    );
    fireEvent.click(screen.getByText("Folder 1"));
    expect(screen.getByTestId("file-route-manager")).toBeInTheDocument();
  });
});
