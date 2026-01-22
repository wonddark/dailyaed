import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import AuthProvider from "@/providers/auth-provider";
import { useAuthContext } from "@/hooks/use-auth-context";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@/i18next";
import { appThemes, breakpoints, settings } from "@/lib/unistyles";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

StyleSheet.configure({
  themes: appThemes,
  breakpoints,
  settings,
});

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
          options={{ headerShown: false, title: "Sign In - DailyAED" }}
        />
        <Stack.Screen
          name="(auth)/sign-up/index"
          options={{ headerShown: false, title: "Sign Up - DailyAED" }}
        />
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen
          name="(root)/daily-summary/index"
          options={{ headerShown: false, title: "Daily Summary - DailyAED" }}
        />
        <Stack.Screen
          name="(root)/monthly-summary/index"
          options={{ headerShown: false, title: "Monthly Summary - DailyAED" }}
        />
        <Stack.Screen
          name="(root)/edit-income/index"
          options={{ headerShown: false, title: "Edit Income - DailyAED" }}
        />
        <Stack.Screen
          name="(root)/edit-expenses/index"
          options={{ headerShown: false, title: "Edit Expenses - DailyAED" }}
        />
        <Stack.Screen
          name="(root)/choose-date/index"
          options={{ headerShown: false, title: "Choose Date - DailyAED" }}
        />
        <Stack.Screen
          name="(root)/settings/index"
          options={{ headerShown: false, title: "Settings - DailyAED" }}
        />
      </Stack.Protected>
    </Stack>
  );
}

SplashScreen.setOptions({
  fade: true,
  duration: 1000,
});
SplashScreen.preventAutoHideAsync();

function SplashScreenController() {
  const { isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide();
    }
  }, [isLoading]);

  if (isLoading) return null;

  return <RootLayout />;
}

function ContextWrapper() {
  const {
    rt: { colorScheme },
  } = useUnistyles();
  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SplashScreenController />
        <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default ContextWrapper;
