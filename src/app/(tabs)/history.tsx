import { supabase } from "@/lib/supabase";
import { Calendar, MapPin, Phone } from "@tamagui/lucide-icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, Linking, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Separator, Text, XStack, YStack } from "tamagui";

interface PatientRecord {
  id: string;
  service_id: string;
  postcode: string;
  created_at: string;
  updated_at: string;
  service: {
    id: string;
    name: string;
    address: string;
    telephone: string;
    latitude: number;
    longitude: number;
  };
}

export default function HistoryPage() {
  const { data: { data: patientRecords } = {}, isLoading } = useQuery({
    queryKey: ["patientRecords"],
    queryFn: async () =>
      supabase
        .from("patient_record")
        .select("*, service(*)")
        .order("created_at", { ascending: false }),
  });

  if (isLoading) {
    return (
      <YStack flex={1} justify="center" items="center">
        <ActivityIndicator size="large" color="$blue10" />
        <Text mt="$2">Loading patient records...</Text>
      </YStack>
    );
  }

  if (!patientRecords || patientRecords.length === 0) {
    return (
      <YStack flex={1} justify="center" items="center" px="$4">
        <Text fontSize="$6" fontWeight="600" text="center">
          No patient records found.
        </Text>
      </YStack>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack px="$4" py="$4" gap="$4">
          {/* Header */}
          <YStack gap="$1">
            <Text fontSize="$8" fontWeight="700">
              Recent Visits
            </Text>
            <Text fontSize="$4">
              {patientRecords.length} record
              {patientRecords.length !== 1 ? "s" : ""}
            </Text>
          </YStack>

          {/* Patient Records List */}
          <YStack gap="$3">
            {Array.isArray(patientRecords) &&
              patientRecords.map((record: PatientRecord) => {
                const openMaps = () => {
                  const url = `https://www.google.com/maps/search/?api=1&query=${record.service.latitude},${record.service.longitude}`;
                  Linking.openURL(url);
                };

                return (
                  <Card
                    key={record.id}
                    overflow="hidden"
                    borderRadius="$5"
                    elevate
                    bg="$background"
                    bordered
                    borderColor="$borderColor"
                  >
                    {/* Location Header */}
                    <YStack
                      height={100}
                      justify="center"
                      items="center"
                      bg="$blue8"
                      pressStyle={{ opacity: 0.8 }}
                      cursor="pointer"
                      onPress={openMaps}
                    >
                      <MapPin size={32} color="white" />
                      <Text color="white" fontSize="$2" mt="$1" opacity={0.9}>
                        {record.service.latitude.toFixed(4)},{" "}
                        {record.service.longitude.toFixed(4)}
                      </Text>
                      <Text color="white" fontSize="$1" mt="$1" opacity={0.7}>
                        Tap to open in Maps
                      </Text>
                    </YStack>

                    <YStack px="$4" py="$3" gap="$2.5">
                      {/* Service Name */}
                      <Text fontSize="$6" fontWeight="700" lineHeight="$1">
                        {record.service.name}
                      </Text>

                      <Separator />

                      {/* Details */}
                      <YStack gap="$2">
                        {/* Address */}
                        <XStack items="flex-start" gap="$2">
                          <MapPin size={16} style={{ marginTop: 2 }} />
                          <Text fontSize="$3" flex={1} lineHeight="$1">
                            {record.service.address}
                          </Text>
                        </XStack>

                        {/* Phone */}
                        <XStack items="center" gap="$2">
                          <Phone size={16} />
                          <Text fontSize="$3">{record.service.telephone}</Text>
                        </XStack>

                        {/* Date and Postcode */}
                        <XStack items="center" gap="$2">
                          <Calendar size={16} />
                          <Text fontSize="$3">
                            {new Date(record.created_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </Text>
                          <Text fontSize="$3" fontWeight="600">
                            • {record.postcode}
                          </Text>
                        </XStack>
                      </YStack>
                    </YStack>
                  </Card>
                );
              })}
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
