import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";

interface SettingsButtonProps {
  updating: boolean;
  handleSave: () => void;
}

const SettingsButtons: React.FC<SettingsButtonProps> = ({
  updating,
  handleSave,
}) => {
  const { hideModal } = useModal();

  return (
    <div className="flex justify-between pt-4 space-x-2">
      <Button variant="outline" className="w-full" onClick={hideModal}>
        Close
      </Button>
      <Button
        variant="default"
        className="w-full"
        onClick={handleSave}
        disabled={updating}
      >
        {updating ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};
export default SettingsButtons;
