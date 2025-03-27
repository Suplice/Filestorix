import { Shortcuts } from "@/store/settingsSlice";
import { Dispatch, SetStateAction } from "react";

interface SettingsShortcutOptions {
  localShortcuts: Shortcuts;
  setLocalShortcuts: Dispatch<SetStateAction<Shortcuts>>;
}

const SettingsShortcutOptions: React.FC<SettingsShortcutOptions> = ({
  localShortcuts,
  setLocalShortcuts,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2">
        <label className="font-semibold">Search Box Shortcut (Ctrl + )</label>
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
          className="border p-2 rounded w-16 text-center dark:bg-neutral-800 dark:border-neutral-700 place-self-end"
        />
      </div>

      <div className="grid grid-cols-2">
        <label className="font-semibold">Toggle Hidden Files (Ctrl + )</label>
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
          className="border p-2 rounded w-16 text-center dark:bg-neutral-800 dark:border-neutral-700 place-self-end"
        />
      </div>
    </div>
  );
};

export default SettingsShortcutOptions;
