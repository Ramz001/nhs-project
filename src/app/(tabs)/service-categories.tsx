import React from "react";
import { ScrollView } from "react-native";
import { YStack, XStack, Text, Card, Circle } from "tamagui";
import {
  Stethoscope,
  School,
  Smile,
  Eye,
  ChevronRight,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";

const serviceCategories = [
  {
    type: "gp",
    label: "General Practitioner",
    icon: Stethoscope,
    description: "Find your local GP surgery",
  },
  {
    type: "school",
    label: "School",
    icon: School,
    description: "Register for school services",
  },
  {
    type: "dentist",
    label: "Dentist",
    icon: Smile,
    description: "Find dental care providers",
  },
  {
    type: "optician",
    label: "Optician",
    icon: Eye,
    description: "Find eye care services",
  },
];

export default function ServiceCategoriesPage() {
  const router = useRouter();

  const handleCategoryPress = (type: string) => {
    console.log("Navigating to services-list with type:", type);
    router.push({
      pathname: "/services-list",
      params: { type },
    });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <YStack px="$4" py="$4" gap="$4">
        {/* Header */}
        <YStack gap="$2">
          <Text fontSize="$9" fontWeight="700">
            Select Service Type
          </Text>
          <Text fontSize="$5" color="$color">
            Choose the type of healthcare service you need
          </Text>
        </YStack>

        {/* Service Categories List */}
        <YStack gap="$3">
          {serviceCategories.map((service) => {
            const Icon = service.icon;

            return (
              <Card
                key={service.type}
                px="$4"
                py="$4"
                borderRadius="$4"
                elevate
                pressStyle={{ scale: 0.98 }}
                onPress={() => handleCategoryPress(service.type)}
              >
                <XStack gap="$4" items="center">
                  {/* Icon Circle */}
                  <Circle rounded={"$4"} size={56} bg="$blue4">
                    <Icon size={28} color="$blue10" />
                  </Circle>

                  {/* Text Content */}
                  <YStack flex={1} gap="$1">
                    <Text fontSize="$6" fontWeight="600">
                      {service.label}
                    </Text>
                    <Text fontSize="$3" color="$color">
                      {service.description}
                    </Text>
                  </YStack>

                  {/* Chevron */}
                  <ChevronRight size={24} color="$color" />
                </XStack>
              </Card>
            );
          })}
        </YStack>

        {/* Info Card */}
        <Card px="$4" py="$4" borderRadius="$4" bg="$blue2">
          <Text fontSize="$4" color="$color">
            Select a service category to view available providers in your area
          </Text>
        </Card>
      </YStack>
    </ScrollView>
  );
}
