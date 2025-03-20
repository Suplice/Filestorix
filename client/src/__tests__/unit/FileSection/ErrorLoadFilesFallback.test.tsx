import { render, screen, fireEvent } from "@testing-library/react";

import { ErrorMessage } from "@/lib/utils/ApiResponses";
import ErrorLoadFilesFallback from "@/components/sections/FileSection/ErrorLoadFilesFallback";

describe("ErrorLoadFilesFallback", () => {
  it("renders error message", () => {
    render(<ErrorLoadFilesFallback reset={jest.fn()} />);

    expect(
      screen.getByText(ErrorMessage.FAILED_FETCH_FILES)
    ).toBeInTheDocument();
  });

  it("renders try again button", () => {
    render(<ErrorLoadFilesFallback reset={jest.fn()} />);

    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();
  });

  it("calls reset function when button is clicked", () => {
    const mockReset = jest.fn();
    render(<ErrorLoadFilesFallback reset={mockReset} />);

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
