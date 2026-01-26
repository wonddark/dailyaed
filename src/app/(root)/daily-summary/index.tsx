import React, { useCallback, useEffect, useState } from "react";
import { Text } from "@/components/themed";
import Button from "@/components/button";
import { StyleSheet } from "react-native-unistyles";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { RootView, View, WrapperView } from "@/components/views";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
} from "react-native";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import { generateWSLink } from "@/utils/share-as-text";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome6";
import ButtonsContainer from "@/components/ButtonsContainer";
import SummaryCard from "@/components/SummaryCard";
import SummaryCardsContainer from "@/components/summary-cards-container";
import * as Notifications from "expo-notifications";

const DailySummary = () => {
  const { t } = useTranslation();
  const { date } = useLocalSearchParams();
  const [data, setData] = useState<{
    income: number;
    expenses: number;
    profit: number;
    notes: string;
  }>({
    income: 0,
    expenses: 0,
    profit: 0,
    notes: "",
  });
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
      .select("*")
      .eq("date", date ?? dayjs().format("YYYY-MM-DD"));
    if (response.data) {
      setData(response.data[0] ?? { income: 0, expenses: 0, profit: 0 });
    }
    setStatus({ loading: false, error: response.error !== null });
  };

  const onShare = () => {
    const link = generateWSLink({
      income: data.income,
      expenses: data.expenses,
      profit: data.profit,
      date: currentDate,
    });
    Linking.openURL(link).finally();
  };

  const onShowNotification = async () => {
    const permissions = await Notifications.getPermissionsAsync();
    if (permissions.status !== Notifications.PermissionStatus.GRANTED) {
      const resp = await Notifications.requestPermissionsAsync();
      if (resp.status == Notifications.PermissionStatus.GRANTED) {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "DailyAED Reminder",
            body: "This is a friendly reminder that you hadn't make the daily input of your income and expenses. Click to insert the data.",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 22,
            minute: 0,
          },
        });

        const tD = await Notifications.getNextTriggerDateAsync({
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 22,
          minute: 0,
        });

        if (tD) {
          Alert.alert(
            "Notification Scheduled",
            `The notification will be triggered everyday at ${dayjs(tD).format("HH:mm")}`,
          );
        }
      }
    }
  };

  useEffect(() => {
    if (Platform.OS === "web" && document !== undefined) {
      document.title = "Daily Summary- DailyAED";
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
          title={t("summary")}
          bottom={
            <View style={styles.dateContainer}>
              <Text
                style={styles.dateLabel}
              >{`${isToday ? t("today") + " - " + currentDate : currentDate}`}</Text>
              <Link href="/choose-date?pickDay=true" asChild>
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

        <SummaryCardsContainer>
          <SummaryCard
            title={t("todayIncome")}
            actionRoute="/edit-income"
            actionIcon="edit"
            actionLabel={t("edit")}
            amount={data.income}
          />
          <SummaryCard
            title={t("todayExpenses")}
            actionRoute="/edit-expenses"
            actionIcon="edit"
            actionLabel={t("edit")}
            amount={data.expenses}
            notes={data.notes}
            notesDate={(date as string) ?? dayjs().format("YYYY-MM-DD")}
          />
          <SummaryCard
            title={t("todayProfit")}
            amount={data.profit}
            big
            amountContext
          />
        </SummaryCardsContainer>

        <ButtonsContainer>
          <Button
            onPress={onShare}
            label={t("shareByWS")}
            style={styles.wideButton}
          />
          <Link href="/monthly-summary" asChild>
            <Button
              label={t("monthlySummary")}
              variant="outlined"
              rightIcon="arrow-right-long"
            />
          </Link>
        </ButtonsContainer>
        <Button onPress={onShowNotification} label="Show Notification" />
      </WrapperView>
    </RootView>
  );
};

export default DailySummary;

const styles = StyleSheet.create((theme) => ({
  headerContainer: {
    alignItems: "flex-start",
    width: "100%",
    gap: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 300,
  },
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
}));
