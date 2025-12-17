import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Text, Card, Button } from "tamagui";
import { MapPin, Phone, Check } from "@tamagui/lucide-icons";
import { useLocalSearchParams } from "expo-router";

// Mock data - will be replaced with actual API data
const mockServices = [
  {
    id: "1",
    name: "Harley Street Medical Practice",
    distance: 0.4,
    address: "123 Harley Street, London",
    phone: "020 7935 4444",
  },
  {
    id: "2",
    name: "City Health Centre",
    distance: 0.8,
    address: "45 Oxford Street, London",
    phone: "020 7123 5678",
  },
  {
    id: "3",
    name: "Westminster Medical Clinic",
    distance: 1.2,
    address: "78 Westminster Road, London",
    phone: "020 7456 7890",
  },
  {
    id: "4",
    name: "Camden Healthcare",
    distance: 1.5,
    address: "92 Camden High Street, London",
    phone: "020 7789 0123",
  },
  {
    id: "5",
    name: "Chelsea Medical Centre",
    distance: 2.1,
    address: "156 Kings Road, London",
    phone: "020 7234 5678",
  },
];

export default function ServicesListPage() {
  const params = useLocalSearchParams();
  const serviceType = (params.type as string) || "gp";
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const getServiceTitle = (type: string) => {
    const titles: Record<string, string> = {
      gp: "General Practitioners",
      school: "Schools",
      dentist: "Dentists",
      optician: "Opticians",
    };
    return titles[type] || "Services";
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack px="$4" py="$4" gap="$4">
          {/* Header */}
          <YStack gap="$2">
            <Text fontSize="$9" fontWeight="700">
              {getServiceTitle(serviceType)}
            </Text>
            <Text fontSize="$5" color="$color">
              {mockServices.length} services found near you
            </Text>
          </YStack>

          {/* Services List */}
          <YStack gap="$3">
            {mockServices.map((service) => {
              const isSelected = selectedService === service.id;

              return (
                <TouchableOpacity
                  key={service.id}
                  onPress={() => handleServiceSelect(service.id)}
                  activeOpacity={0.7}
                >
                  <Card
                    px="$4"
                    py="$4"
                    borderRadius="$4"
                    elevate
                    borderWidth={isSelected ? 2 : 0}
                    borderColor={isSelected ? "$blue10" : "transparent"}
                    bg={isSelected ? "$blue2" : "$background"}
                    pressStyle={{ scale: 0.98 }}
                  >
                    <YStack gap="$3">
                      {/* Header Row */}
                      <XStack items="center" justify="space-between">
                        <YStack flex={1} gap="$1">
                          <Text fontSize="$6" fontWeight="600">
                            {service.name}
                          </Text>
                          <XStack items="center" gap="$2">
                            <MapPin size={16} color="$blue10" />
                            <Text
                              fontSize="$4"
                              fontWeight="600"
                              color="$blue10"
                            >
                              {service.distance} km
                            </Text>
                          </XStack>
                        </YStack>
                        {isSelected && (
                          <XStack
                            bg="$blue10"
                            px="$3"
                            py="$2"
                            rounded="$4"
                            items="center"
                            gap="$2"
                          >
                            <Check size={16} color="white" />
                            <Text fontSize="$3" fontWeight="600" color="white">
                              Selected
                            </Text>
                          </XStack>
                        )}
                      </XStack>

                      {/* Address */}
                      <XStack items="flex-start" gap="$2">
                        <MapPin
                          size={16}
                          color="$color"
                          style={{ marginTop: 2 }}
                        />
                        <Text fontSize="$4" color="$color" flex={1}>
                          {service.address}
                        </Text>
                      </XStack>

                      {/* Phone */}
                      <XStack items="center" gap="$2">
                        <Phone size={16} color="$color" />
                        <Text fontSize="$4" color="$color">
                          {service.phone}
                        </Text>
                      </XStack>
                    </YStack>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </YStack>

          {/* Action Button */}
          {selectedService && (
            <Button theme="blue" size="$5" mt="$2">
              <Text color="white" fontWeight="600" fontSize="$5">
                Continue with Selected Service
              </Text>
            </Button>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
