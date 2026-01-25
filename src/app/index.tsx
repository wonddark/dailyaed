import React, { useEffect } from "react";
import { Text } from "@/components/themed";
import { StyleSheet } from "react-native-unistyles";
import { Link } from "expo-router";
import { Platform } from "react-native";
import Button from "@/components/button";
import { RootView, View, WrapperView } from "@/components/views";
import { useTranslation } from "react-i18next";
import ButtonsContainer from "@/components/ButtonsContainer";
import { Image } from "expo-image";

const Welcome = () => {
  const { t } = useTranslation();
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  useEffect(() => {
    if (Platform.OS === "web" && document !== undefined) {
      document.title = "Welcome - DailyAED";
    }
  }, []);

  return (
    <RootView>
      <WrapperView>
        <View style={styles.header}>
          <Text style={styles.title}>
            {t("welcome")} <Text style={styles.appName}>{t("appName")}</Text>
          </Text>
          <Text style={styles.subtitle}>{t("appSlogan")}</Text>
        </View>
        <View style={{ flex: 1, gap: 32 }}>
          <View
            style={{
              flex: 1,
              maxHeight: 400,
              gap: 8,
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/welcome.jpg")}
              style={styles.image}
              contentFit="cover"
              placeholder={{ blurhash }}
              alt="Welcome to DailyAED!"
            />
            <Text style={styles.headline}>
              {t("appTagline")}{" "}
              <Text style={styles.bolded}>{t("easyAndFast")}</Text>{" "}
              {t("profitCalculus")}.
            </Text>
          </View>
          <ButtonsContainer>
            <Link href="/sign-up" asChild style={styles.wideButton}>
              <Button label={t("createAccount")} />
            </Link>
            <Link href="/sign-in" asChild>
              <Button
                label={t("signIn")}
                rightIcon="arrow-right-long"
                variant="outlined"
              />
            </Link>
          </ButtonsContainer>
        </View>
      </WrapperView>
    </RootView>
  );
};

export default Welcome;

const styles = StyleSheet.create((theme, miniRuntime) => ({
  header: {
    marginVertical: 40,
  },
  title: {
    fontSize: {
      xs: 40,
      lg: 60,
    },
    fontWeight: 300,
    textAlign: "center",
  },
  appName: {
    fontWeight: 700,
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: { xs: 12, lg: 16 },
    color: theme.colors.body2,
    textAlign: "center",
  },
  headline: {
    fontWeight: 300,
    textAlign: "center",
    width: "85%",
    fontSize: {
      xs: 12,
      lg: 20,
    },
  },
  bolded: {
    fontWeight: 700,
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
  image: {
    aspectRatio: 1,
    width: "85%",
    borderRadius: 1000,
  },
  wideButton: {
    flex: 1,
  },
}));
