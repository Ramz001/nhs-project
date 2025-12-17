import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as ThemeProviderRN,
} from "@react-navigation/native";
import "react-native-reanimated";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const colorScheme = useColorScheme();

  return (
    <ThemeProviderRN value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {children}
    </ThemeProviderRN>
  );
}
