import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="service-categories"
        options={{
          title: "Service Categories",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="services-list"
        options={{
          title: "Services List",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
