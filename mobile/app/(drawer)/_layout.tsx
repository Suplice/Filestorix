import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/ui/CustomDrawerContent";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        // Wskazujemy nasz customowy komponent
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          // Ukrywamy domyślny header Drawera na rzecz nagłówka ekranu lub własnego
          headerShown: true,
          headerStyle: {
            backgroundColor: "#020617",
            elevation: 0, // Android shadow remove
            shadowOpacity: 0, // iOS shadow remove
            borderBottomWidth: 1,
            borderBottomColor: "#1e293b",
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          // Ikona burgera (menu)
          drawerType: "front", // slide, front, back
          drawerStyle: {
            backgroundColor: "#020617",
            width: 300,
          },
        }}
      >
        <Drawer.Screen
          name="home" // To musi odpowiadać plikowi app/(drawer)/home.tsx lub app/(drawer)/home/index.tsx
          options={{
            title: "CodeQuest", // Tytuł na górze ekranu
          }}
        />

        <Drawer.Screen
          name="courses"
          options={{
            title: "Courses",
          }}
        />

        <Drawer.Screen
          name="leaderboard"
          options={{
            title: "Leaderboard",
          }}
        />

        <Drawer.Screen
          name="friends"
          options={{
            title: "Friends",
          }}
        />

        <Drawer.Screen
          name="profile"
          options={{
            title: "Profile",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
