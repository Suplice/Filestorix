import SearchCommand from "../SearchCommand/searchCommand";
import ThemeModeToggle from "@/components/sections/ThemeSection/ThemeModeToggle";
import { useAuth } from "@/context/AuthContext";
import { Flame, Star, Coins } from "lucide-react";

const AppTopbar = () => {
  // przykładowe dane – później możesz pobrać z backendu
  const { user } = useAuth();
  return (
    <div className="flex flex-row w-full items-center justify-between ">
      <SearchCommand />

      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>{user?.streakCount} day streak</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>Lv. {user?.level}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Coins className="h-4 w-4 text-amber-500" />
              <span>{user?.points}</span>
            </div>
          </>
        )}

        <ThemeModeToggle />

        <img
          src={user?.avatarURL || "https://placehold.co/600x400"}
          alt="User avatar"
          className="h-8 w-8 rounded-full border border-border"
        />
      </div>
    </div>
  );
};

export default AppTopbar;
