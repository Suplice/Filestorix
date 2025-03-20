import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useModal } from "@/hooks/use-modal";
import useSettings from "@/hooks/use-settings";
import SettingsModal from "@/components/sections/SettingsSection/SettingsModal";

jest.mock("@/hooks/use-modal");
jest.mock("@/hooks/use-settings");

jest.mock("lucide-react", () => ({
  ChevronUp: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="mock-file-icon-chevron-up" {...props} />
  ),
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="mock-file-icon-chevron-down" {...props} />
  ),
  Check: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="mock-file-icon-check" {...props} />
  ),
}));

describe("SettingsModal", () => {
  let mockHideModal: jest.Mock;
  let mockUpdateSettings: jest.Mock;

  beforeEach(() => {
    mockHideModal = jest.fn();
    mockUpdateSettings = jest.fn(() => Promise.resolve());

    (useModal as jest.Mock).mockReturnValue({ hideModal: mockHideModal });
    (useSettings as jest.Mock).mockReturnValue({
      updateSettings: mockUpdateSettings,
      updating: false,
      settings: {
        theme: "light",
        showHiddenFiles: false,
        shortcuts: {
          openSearchBox: "s",
          toggleHiddenFiles: "h",
        },
      },
      loading: false,
    });
  });

  it("renders correctly", () => {
    render(<SettingsModal />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Theme")).toBeInTheDocument();
  });

  it("updates local state when changing theme", () => {
    render(<SettingsModal />);
    const select = screen.getByTestId("selectTheme").childNodes[1];
    fireEvent.click(select);
    fireEvent.click(screen.getByText("Dark"));
    expect(screen.getByText("Dark")).toBeInTheDocument();
  });

  it("calls updateSettings and closes modal on save", async () => {
    render(<SettingsModal />);
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalled();
      expect(mockHideModal).toHaveBeenCalled();
    });
  });
});
