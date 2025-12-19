/* eslint-disable import/no-named-as-default */
import {
  setLocation,
  setPostcode,
} from "@/features/navigation/navigation.slice";
import { getLocationFromPostcode } from "@/lib/get-location-from-postcode";
import { getPostcodeFromLocation } from "@/lib/get-postcode-from-location";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { MapPin } from "@tamagui/lucide-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Input, Text, YStack } from "tamagui";
import z from "zod";

const SearchValidationSchema = z.object({
  postcode: z
    .number({ error: "Please provide a valid postcode" })
    .min(100000, { error: "Please provide a valid postcode" })
    .max(999999, { error: "Please provide a valid postcode" }),
  age: z.int().min(0).max(99).optional(),
});

export default function HomePage() {
  const router = useRouter();
  const { postcode, location } = useAppSelector((state) => state.navigation);
  const dispatch = useAppDispatch();
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const validated = SearchValidationSchema.safeParse({
        postcode: Number(postcode),
      });

      if (!validated.success) {
        const firstError = validated.error.issues[0];
        Alert.alert("Validation Error", firstError.message);
        return;
      }

      if (location?.latitude && location.longitude) {
        router.push("/service-category");
        return;
      }

      const postcodeLocation = await getLocationFromPostcode(postcode!);

      if (
        !location?.latitude &&
        !location?.longitude &&
        postcodeLocation?.latitude &&
        postcodeLocation?.longitude
      ) {
        dispatch(setLocation(postcodeLocation));
        router.push("/service-category");
      }
    } catch (e) {
      Alert.alert(
        e instanceof Error ? e.message : "An unexpected error occurred"
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "Allow location access to auto-fill your postcode."
        );
        return;
      }

      const liveLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const postcode = await getPostcodeFromLocation(
        liveLocation.coords.latitude,
        liveLocation.coords.longitude
      );

      if (postcode) {
        dispatch(setPostcode(postcode));
        dispatch(
          setLocation({
            latitude: liveLocation.coords.latitude,
            longitude: liveLocation.coords.longitude,
          })
        );
      } else {
        console.log(liveLocation, postcode);

        Alert.alert(
          "Postcode not found",
          "We could not determine your postcode from this location."
        );
      }
    } catch (error) {
      console.warn("Location error:", error);
      Alert.alert("Error", "Failed to retrieve your location.");
    } finally {
      setIsGettingLocation(false);
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
              disabled={isGettingLocation}
              opacity={isGettingLocation ? 0.6 : 1}
              variant="outlined"
              size="$3"
              icon={MapPin}
              self="flex-start"
            >
              {isGettingLocation ? "Getting Location..." : "Use My Location"}
            </Button>

            <Text fontSize="$3" color="$color" my="$1">
              Example postcodes: 100115, 100190,
            </Text>

            {/* Search Button */}
            <Button
              theme="blue"
              mt="$3"
              onPress={handleSearch}
              disabled={isSearching}
              opacity={isSearching ? 0.6 : 1}
            >
              <Text color="white">
                {isSearching ? "Searching..." : "Search Services"}
              </Text>
            </Button>
          </Card>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
