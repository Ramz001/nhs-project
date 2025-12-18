import { MapPin } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Input, Text, YStack } from "tamagui";

export default function HomePage() {
  const router = useRouter();

  const handleSearch = () => {
    router.push("/service-categories");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack px="$4" py="$4" gap="$4">
          {/* Header */}
          <Text fontSize="$9" fontWeight="700">
            NHS Healthcare Services
          </Text>
          <Text fontSize="$5" color="$color">
            Find local GP, Dentist, Optician, and School/Nursery services
          </Text>

          {/* Service Finder Card */}
          <Card px="$4" py="$4" borderRadius="$4" elevate gap="$3">
            <Text fontSize="$7" fontWeight="600">
              Service Finder
            </Text>
            <Text fontSize="$4" color="$color">
              Enter the patient postcode or use your current location to find
              nearby services
            </Text>

            {/* Postcode Input */}
            <Input
              placeholder="e.g., 100123"
              borderColor="$borderColor"
              borderWidth={1}
              px="$2.5"
              py="$2.5"
            />

            {/* Location Button */}
            <Button theme="blue" mt="$2" icon={MapPin}>
              <Text color="white">Use Current Location</Text>
            </Button>

            <Text fontSize="$3" color="$color" my="$1">
              Example postcodes: 100150, 400200, 100122, 400211
            </Text>

            {/* Age Input */}
            <Input
              placeholder="Age"
              borderColor="$borderColor"
              borderWidth={1}
              px="$2.5"
              py="$2.5"
              keyboardType="numeric"
              mt="$2"
            />

            {/* Search Button */}
            <Button theme="green" mt="$3" onPress={handleSearch}>
              <Text color="white">Search Services</Text>
            </Button>
          </Card>

          {/* History Placeholder */}
          <Card px="$4" py="$4" borderRadius="$4" elevate gap="$2">
            <Text fontSize="$7" fontWeight="600">
              History
            </Text>
            <Text fontSize="$4" color="$color">
              Previously searched services will appear here.
            </Text>
          </Card>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
