import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GeneralOptions, Theme } from "@/store/settingsSlice";
import { Dispatch, SetStateAction } from "react";

interface SettingsSelectOptionsProps {
  localGeneralOptions: GeneralOptions;
  setLocalGeneralOptions: Dispatch<SetStateAction<GeneralOptions>>;
}

const SettingsSelectOptions: React.FC<SettingsSelectOptionsProps> = ({
  localGeneralOptions,
  setLocalGeneralOptions,
}) => {
  return (
    <>
      <div className="space-y-2" data-testid="selectTheme">
        <label className="font-semibold">Theme</label>
        <Select
          name="selectTest"
          value={localGeneralOptions.theme}
          onValueChange={(value: Theme) =>
            setLocalGeneralOptions((prev) => ({
              ...prev,
              theme: value,
            }))
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
          value={localGeneralOptions.showHiddenFiles ? "True" : "False"}
          onValueChange={(value: "True" | "False") =>
            setLocalGeneralOptions((prev) => ({
              ...prev,
              showHiddenFiles: value === "True",
            }))
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
    </>
  );
};

export default SettingsSelectOptions;
