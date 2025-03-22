import ModalWrapper from "@/components/sections/FileSection/ModalWrapper";
import { useModal } from "@/hooks/use-modal";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("ModalWrapper", () => {
  let mockHideModal: jest.Mock;

  beforeEach(() => {
    mockHideModal = jest.fn();

    (useModal as jest.Mock).mockReturnValue({
      hideModal: mockHideModal,
    });
  });

  it("renders components correctly", () => {
    render(
      <ModalWrapper>
        <div>children</div>
      </ModalWrapper>
    );

    expect(screen.getByText("children")).toBeInTheDocument();
  });

  it("modal hides, after clicking background", async () => {
    render(
      <ModalWrapper>
        <div>children</div>
      </ModalWrapper>
    );

    fireEvent.mouseDown(screen.getByTestId("testBackground"));
    expect(mockHideModal).toHaveBeenCalled();
  });
});
