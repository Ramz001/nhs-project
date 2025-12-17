import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as ThemeProviderRN,
} from "@react-navigation/native";
import "react-native-reanimated";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "@/lib/tamagui.config";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProviderRN
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        {children}
      </ThemeProviderRN>
    </TamaguiProvider>
  );
}
