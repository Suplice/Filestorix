import { Card, CardContent } from "@/components/ui/card";
import useSettings from "@/hooks/use-settings";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import useLocalSettings from "@/hooks/use-local-settings";
import SettingsShortcutOptions from "./SettingsShortcutOptions";
import SettingsSelectOptions from "./SettingsSelectOptions";
import SettingsButtons from "./SettingsButtons";

const SettingsModal = () => {
  const { updateSettings, updating, settings, loading } = useSettings();
  const {
    localGeneralOptions,
    localShortcuts,
    setLocalGeneralOptions,
    setLocalShortcuts,
    handleSave,
  } = useLocalSettings({ settings: settings, updateSettings: updateSettings });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="w-full h-full py-6 px-6 bg-white dark:bg-neutral-900 rounded-none">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Settings</h2>

        <SettingsSelectOptions
          localGeneralOptions={localGeneralOptions}
          setLocalGeneralOptions={setLocalGeneralOptions}
        />

        <SettingsShortcutOptions
          localShortcuts={localShortcuts}
          setLocalShortcuts={setLocalShortcuts}
        />

        <SettingsButtons handleSave={handleSave} updating={updating} />
      </CardContent>
    </Card>
  );
};

export default SettingsModal;
