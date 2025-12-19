import {
  setAgeFilter,
  setPostcode,
} from "@/features/navigation/navigation.slice";
import { getPostcodeFromCoords } from "@/lib/get-postcode-from-coords";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { MapPin } from "@tamagui/lucide-icons";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Input, Text, YStack } from "tamagui";

const { googleMapsApiKey } = Constants.expoConfig?.extra || {};

export default function HomePage() {
  const router = useRouter();
  const postcode = useAppSelector((state) => state.navigation.postcode);
  const age = useAppSelector((state) => state.navigation.ageFilter);
  const dispatch = useAppDispatch();

  const handleSearch = () => {
    router.push("/service-category");
  };

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "Allow location access to auto-fill your postcode."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const postcode = await getPostcodeFromCoords(
        location.coords.latitude,
        location.coords.longitude,
        googleMapsApiKey
      );

      if (postcode) {
        dispatch(setPostcode(postcode));
      } else {
        Alert.alert(
          "Postcode not found",
          "We could not determine your postcode from this location."
        );
      }
    } catch (error) {
      console.warn("Location error:", error);
      Alert.alert("Error", "Failed to retrieve your location.");
    }
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
              value={postcode || ""}
              onChangeText={(value) => dispatch(setPostcode(value))}
              px="$2.5"
              py="$2.5"
            />

            {/* Location Button */}
            <Button
              onPress={handleUseCurrentLocation}
              theme="blue"
              mt="$2"
              icon={MapPin}
            >
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
              value={age ? String(age) : ""}
              onChangeText={(value) =>
                dispatch(setAgeFilter(value ? Number(value) : null))
              }
              keyboardType="numeric"
              mt="$2"
            />

            {/* Search Button */}
            <Button theme="green" mt="$3" onPress={handleSearch}>
              <Text color="white">Search Services</Text>
            </Button>
          </Card>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
