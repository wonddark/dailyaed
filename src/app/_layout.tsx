import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native-unistyles";
import AuthProvider from "@/providers/auth-provider";
import { useAuthContext } from "@/hooks/use-auth-context";
import { SplashScreenController } from "@/components/SplashScreenController";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import "@/i18next";

function RootLayout() {
  const { isLoggedIn } = useAuthContext();

  return (
    <Stack>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: "Welcome - DailyAED" }}
        />
        <Stack.Screen
          name="(auth)/sign-in/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(auth)/sign-up/index"
          options={{ headerShown: false }}
        />
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen
          name="(root)/daily-summary/index"
          options={{ headerShown: false, title: "Daily Summary" }}
        />
        <Stack.Screen
          name="(root)/monthly-summary/index"
          options={{ headerShown: false, title: "Monthly Summary" }}
        />
        <Stack.Screen
          name="(root)/edit-income/index"
          options={{ headerShown: false, title: "Edit Income" }}
        />
        <Stack.Screen
          name="(root)/edit-expenses/index"
          options={{ headerShown: false, title: "Edit Expenses" }}
        />
        <Stack.Screen
          name="(root)/choose-date/index"
          options={{ headerShown: false, title: "Choose Date" }}
        />
        <Stack.Screen
          name="(root)/settings/index"
          options={{ headerShown: false, title: "Settings" }}
        />
      </Stack.Protected>
    </Stack>
  );
}

function ContextWrapper() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <SplashScreenController />
        <RootLayout />
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default ContextWrapper;

const styles = StyleSheet.create(() => ({
  root: {
    flex: 1,
    paddingHorizontal: 20,
  },
  wrapper: {
    flex: 1,
    width: "100%",
    maxWidth: 720,
    marginHorizontal: "auto",
  },
}));
