import React, { useEffect } from "react";
import { Text } from "@/components/themed";
import { StyleSheet } from "react-native-unistyles";
import { Link } from "expo-router";
import { Platform } from "react-native";
import Button from "@/components/button";
import { View } from "@/components/views";
import { useTranslation } from "react-i18next";

const Welcome = () => {
  const { t } = useTranslation();

  useEffect(() => {
    if (Platform.OS === "web" && document !== undefined) {
      document.title = "Welcome - DailyAED";
    }
  }, []);

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t("welcome")} <Text style={styles.appName}>{t("appName")}</Text>
        </Text>
        <Text style={styles.subtitle}>{t("appSlogan")}</Text>
      </View>
      <Text style={styles.headline}>
        {t("appTagline")}{" "}
        <Text style={styles.semiBolded}>{t("easyAndFast")}</Text>{" "}
        {t("profitCalculus")}.
      </Text>
      <View style={styles.buttonsContainer}>
        <Link href="/sign-up" asChild>
          <Button label={t("createAccount")} />
        </Link>
        <Link href="/sign-in" asChild>
          <Button label={t("signIn")} variant="secondary" />
        </Link>
      </View>
    </>
  );
};

export default Welcome;

const styles = StyleSheet.create((theme, miniRuntime) => ({
  header: {
    marginVertical: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 300,
    textAlign: "center",
  },
  appName: {
    fontWeight: 700,
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.muted,
    textAlign: "center",
  },
  headline: {
    fontWeight: 300,
    textAlign: "center",
  },
  semiBolded: {
    fontWeight: 600,
  },
  buttonsContainer: {
    width: "100%",
    minWidth: 160,
    maxWidth: 370,
    marginTop: 64,
    gap: 8,
    marginHorizontal: "auto",
  },
  buttonText: {
    fontWeight: 500,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
  },
}));
