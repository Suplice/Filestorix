import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/ui/CustomDrawerContent";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#020617",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#1e293b",
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          drawerType: "front",
          drawerStyle: {
            backgroundColor: "#020617",
            width: 300,
          },
        }}
      >
        <Drawer.Screen
          name="home"
          options={{
            title: "CodeQuest",
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
