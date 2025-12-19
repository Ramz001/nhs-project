import { Clock, Search } from "@tamagui/lucide-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Search size={size} color={color as any} />
          ),
        }}
      />
      <Tabs.Screen
        name="service-category"
        options={{
          title: "Service Categories",
          headerShown: false,
          href: null,
        }}
      />
      <Tabs.Screen
        name="service-list"
        options={{
          title: "Services List",
          headerShown: false,
          href: null,
        }}
      />
      <Tabs.Screen
        name="service-detail"
        options={{
          title: "Service Detail",
          headerShown: false,
          href: null,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Clock color={color as any} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
