import RootProvider from "@/providers/root.provider";
import { Stack } from "expo-router";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <RootProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            title: "Home",
            navigationBarHidden: true,
          }}
        />
        <Stack.Screen name="service-categories" />
        <Stack.Screen name="services-list" />
      </Stack>
    </RootProvider>
  );
}
