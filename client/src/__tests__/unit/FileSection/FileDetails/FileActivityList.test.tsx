import FileActivityList from "@/components/sections/FileSection/FileDetails/FileActivityList";
import { useQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { ActivityLog } from "@/lib/types/activityLog";

describe("FileActivityList", () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: null,
      error: null,
      refetch: jest.fn(),
    });
  });

  it("renders correctly", () => {
    render(<FileActivityList fileId={2} />);

    expect(screen.getByText("File Activity")).toBeInTheDocument();
  });

  test.each([
    [
      [
        {
          id: 3,
          userId: 4,
          fileId: 5,
          action: "TestAction",
          details: "Test",
          performedAt: new Date(),
        },
      ],
      true,
    ],
    [undefined, false],
  ])(
    "test for diffrent activity logs",
    (data: ActivityLog[] | undefined, result) => {
      (useQuery as jest.Mock).mockReturnValue({
        isLoading: false,
        data: data,
        error: null,
        refetch: jest.fn(),
      });

      render(<FileActivityList fileId={5} />);

      if (result) {
        expect(screen.getByText("TestAction")).toBeInTheDocument();
      } else {
        expect(screen.getByText("No activity found.")).toBeInTheDocument();
      }
    }
  );
});
