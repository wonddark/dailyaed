import React, { useCallback, useEffect, useState } from "react";
import { Text } from "@/components/themed";
import Button from "@/components/button";
import { StyleSheet } from "react-native-unistyles";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { RootView, View, WrapperView } from "@/components/views";
import { ActivityIndicator, Platform, Pressable } from "react-native";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome6";
import ButtonsContainer from "@/components/ButtonsContainer";

const DailyNotes = () => {
  const { t } = useTranslation();
  const { date } = useLocalSearchParams();
  const [data, setData] = useState<string>("");
  const [status, setStatus] = useState<{ loading: boolean; error: boolean }>({
    loading: true,
    error: false,
  });
  const isToday = dayjs().isSame(date as string | undefined, "day");
  const currentDate = dayjs(date as string | undefined).format(
    isToday ? "MMM DD" : "ddd, MMM DD",
  );

  const getStoredData = async () => {
    setStatus({ loading: true, error: false });
    const response = await supabase
      .from("records")
      .select("notes")
      .eq("date", date ?? dayjs().format("YYYY-MM-DD"));
    if (response.data) {
      setData(response.data[0]?.notes ?? "");
    }
    setStatus({ loading: false, error: response.error !== null });
  };

  useEffect(() => {
    if (Platform.OS === "web" && document !== undefined) {
      document.title = "Daily Notes- DailyAED";
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getStoredData().finally();
    }, [date]),
  );

  if (status.loading) {
    return (
      <RootView>
        <WrapperView>
          <View center="all">
            <ActivityIndicator size="large" color={styles.icon.color} />
          </View>
        </WrapperView>
      </RootView>
    );
  }

  if (status.error) {
    return (
      <RootView>
        <WrapperView>
          <Text>
            There was an error when loading the data. Please try again in a few
            seconds.
          </Text>
          <Button label="Try again" onPress={getStoredData} />
        </WrapperView>
      </RootView>
    );
  }

  return (
    <RootView>
      <WrapperView>
        <PageHeader
          title={t("notes")}
          bottom={
            <View style={styles.dateContainer}>
              <Text
                style={styles.dateLabel}
              >{`${isToday ? t("today") + " - " + currentDate : currentDate}`}</Text>
              <Link href="/choose-date?pickDay=true&notes=true" asChild>
                <Pressable style={styles.link}>
                  <FontAwesomeIcons
                    name="calendar-check"
                    color={styles.icon.color}
                    size={styles.icon.height}
                  />
                  <Text style={styles.linkText}>{t("changeDate")}</Text>
                </Pressable>
              </Link>
            </View>
          }
        />

        <View style={styles.notesWrapper}>
          {data.length > 0 ? (
            data
              .split("\n")
              .map((line, index) => <Text key={`${index}`}>{line}</Text>)
          ) : (
            <Text style={styles.alertText}>{t("noNoteFound")}</Text>
          )}
        </View>

        <ButtonsContainer style={styles.buttonsApart}>
          <Link href="/daily-summary" asChild dismissTo>
            <Button
              leftIcon="arrow-left-long"
              label={t("back")}
              variant="outlined"
            />
          </Link>
          <Link
            href={`/edit-notes?date=${date}`}
            asChild
            style={styles.wideButton}
          >
            <Button label={t("editNotes")} variant="secondary" />
          </Link>
        </ButtonsContainer>
      </WrapperView>
    </RootView>
  );
};

export default DailyNotes;

const styles = StyleSheet.create((theme) => ({
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  dateLabel: {
    opacity: 0.55,
    fontSize: {
      xs: 12,
      lg: 14,
    },
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  linkText: {
    fontFamily: "Inter-Light",
    fontSize: {
      xs: 12,
      lg: 16,
    },
    color: theme.colors.accent,
  },
  icon: {
    color: theme.colors.accent,
    height: {
      xs: 12,
      lg: 14,
    },
  },
  wideButton: {
    flex: 1,
  },
  alertText: {
    fontSize: {
      xs: 15,
      lg: 18,
    },
    lineHeight: {
      xs: 15 * 1.5,
      lg: 18 * 1.5,
    },
    color: theme.colors.body2,
  },
  buttonsApart: {
    marginTop: {
      xs: 20,
      lg: 32,
    },
  },
  notesWrapper: {
    gap: {
      xs: 2,
      lg: 4,
    },
  },
}));
