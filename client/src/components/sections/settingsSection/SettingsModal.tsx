import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModal } from "@/hooks/use-modal";
import useSettings from "@/hooks/use-settings";
import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { SettingRecord } from "@/lib/types/settings";
import { toast } from "sonner";

const SettingsModal = () => {
  const { hideModal } = useModal();
  const { updateSettings, updating, settings, loading } = useSettings();

  const [localTheme, setLocalTheme] = useState(settings.theme);
  const [localHiddenFiles, setLocalHiddenFiles] = useState(
    settings.showHiddenFiles
  );
  const [localShortcuts, setLocalShortcuts] = useState({
    ...settings.shortcuts,
  });

  const handleSave = async () => {
    const settingsToUpdate: SettingRecord[] = [
      { setting_key: "theme", setting_value: localTheme },
      {
        setting_key: "showHiddenFiles",
        setting_value: localHiddenFiles ? "true" : "false",
      },
      {
        setting_key: "openSearchBox",
        setting_value: localShortcuts.openSearchBox,
      },
      {
        setting_key: "toggleHiddenFiles",
        setting_value: localShortcuts.toggleHiddenFiles,
      },
    ];

    const settingsMap = new Set<string>();

    for (const setting of settingsToUpdate) {
      if (settingsMap.has(setting.setting_value)) {
        toast.error("One value can't be associated with multiple settings.");
        return;
      }
      settingsMap.add(setting.setting_value);
    }

    await updateSettings(settingsToUpdate);
    setTimeout(() => {
      hideModal();
    }, 100);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="w-full h-full py-6 px-6 bg-white dark:bg-neutral-900 rounded-none">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Settings</h2>

        <div className="space-y-2" data-testid="selectTheme">
          <label className="font-semibold">Theme</label>
          <Select
            name="selectTest"
            value={localTheme}
            onValueChange={(value: "light" | "dark" | "system") =>
              setLocalTheme(value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="font-semibold">Show hidden files</label>
          <Select
            value={localHiddenFiles ? "True" : "False"}
            onValueChange={(value: "True" | "False") =>
              setLocalHiddenFiles(value === "True")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="True">True</SelectItem>
              <SelectItem value="False">False</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="space-x-2">
            <label className="font-semibold">
              Search Box Shortcut (Ctrl + )
            </label>
            <input
              type="text"
              maxLength={1}
              value={localShortcuts.openSearchBox}
              onChange={(e) =>
                setLocalShortcuts((prev) => ({
                  ...prev,
                  openSearchBox: e.target.value.toLowerCase(),
                }))
              }
              className="border p-2 rounded w-16 text-center dark:bg-neutral-800 dark:border-neutral-700"
            />
          </div>

          <div className="space-x-2">
            <label className="font-semibold">
              Toggle Hidden Files (Ctrl + )
            </label>
            <input
              data-testid="toggleHiddenTestInput"
              type="text"
              maxLength={1}
              value={localShortcuts.toggleHiddenFiles}
              onChange={(e) =>
                setLocalShortcuts((prev) => ({
                  ...prev,
                  toggleHiddenFiles: e.target.value.toLowerCase(),
                }))
              }
              className="border p-2 rounded w-16 text-center dark:bg-neutral-800 dark:border-neutral-700"
            />
          </div>
        </div>

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
      </CardContent>
    </Card>
  );
};

export default SettingsModal;
