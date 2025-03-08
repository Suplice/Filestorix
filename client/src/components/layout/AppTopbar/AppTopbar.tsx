import ThemeModeToggle from "@/components/sections/ThemeSection/ThemeModeToggle";
import SearchCommand from "../SearchCommand/SearchCommand";

const AppTopbar = () => {
  return (
    <div className="flex flex-row w-full items-center justify-between ">
      <SearchCommand />
      <ThemeModeToggle />
    </div>
  );
};

export default AppTopbar;
