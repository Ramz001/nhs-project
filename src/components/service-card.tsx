import {
  Service,
  setCurrentService,
} from "@/features/navigation/navigation.slice";
import { getDistanceFromLatLonInKm } from "@/lib/get-distance-from-lat-lon";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Check, MapPin, Phone } from "@tamagui/lucide-icons";
import { Card, Text, XStack, YStack } from "tamagui";

export default function ServiceCard({ service }: { service: Service }) {
  const dispatch = useAppDispatch();
  const { currentService, location } = useAppSelector(
    (store) => store.navigation
  );

  const isSelected = currentService?.id === service.id;
  const distance =
    location && service.latitude && service.longitude
      ? getDistanceFromLatLonInKm(
          location.latitude,
          location.longitude,
          service.latitude,
          service.longitude
        ).toFixed(1)
      : null;
  return (
    <Card
      key={service.id}
      px="$4"
      py="$4"
      borderRadius="$4"
      elevate
      borderWidth={isSelected ? 2 : 0}
      borderColor={isSelected ? "$blue10" : "transparent"}
      bg={isSelected ? "$blue2" : "$background"}
      pressStyle={{ scale: 0.98 }}
      onPress={() => dispatch(setCurrentService(service))}
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
              <Text fontSize="$4" fontWeight="600" color="$blue10">
                {distance || 0} km
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
          <MapPin size={16} color="$color" style={{ marginTop: 2 }} />
          <Text fontSize="$4" color="$color" flex={1}>
            {service.address}
          </Text>
        </XStack>

        {/* Phone */}
        <XStack items="center" gap="$2">
          <Phone size={16} color="$color" />
          <Text fontSize="$4" color="$color">
            {service.telephone}
          </Text>
        </XStack>
      </YStack>
    </Card>
  );
}
