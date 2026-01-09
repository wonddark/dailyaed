import React, { useCallback, useEffect, useState } from "react";
import { Text } from "@/components/themed";
import Button from "@/components/button";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { RootView, View } from "@/components/views";
import { ActivityIndicator, Linking, Platform, Pressable } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";
import { generateWSLink } from "@/utils/share-as-text";
import PageHeader from "@/components/PageHeader";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const MonthlySummary = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<
    { income: number; expenses: number; profit: number; date: string }[]
  >([]);
  const [status, setStatus] = useState<{ loading: boolean; error: boolean }>({
    loading: true,
    error: false,
  });
  const { date } = useLocalSearchParams();
  const currentDate = dayjs(date as string | undefined);
  const currentMonth = currentDate.format("MMM YYYY");

  const totalIncome = data.reduce((acc, curr) => acc + curr.income, 0);
  const totalExpenses = data.reduce((acc, curr) => acc + curr.expenses, 0);
  const totalProfit = totalIncome - totalExpenses;

  const getData = async () => {
    setStatus({ loading: true, error: false });
    const response = await supabase
      .from("records")
      .select("income, expenses, profit, date")
      .gt("date", dayjs(currentDate).set("day", 0).format("YYYY-MM-DD"))
      .lt(
        "date",
        dayjs(currentDate).add(1, "month").set("day", 1).format("YYYY-MM-DD"),
      );

    if (response.data) {
      setData(response.data);
    }

    setStatus({ loading: false, error: response.error !== null });
  };

  const onShare = () => {
    const link = generateWSLink({
      income: totalIncome,
      expenses: totalExpenses,
      profit: totalProfit,
      date: currentMonth,
      daily: false,
    });
    Linking.openURL(link);
  };

  useEffect(() => {
    if (Platform.OS === "web" && document !== undefined) {
      document.title = "Monthly Summary - DailyAED";
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData().finally();
    }, [date]),
  );

  if (status.loading) {
    return (
      <RootView>
        <ActivityIndicator size="large" />
      </RootView>
    );
  }

  if (status.error) {
    return (
      <RootView>
        <Text>
          There was an error when loading the data. Please try again in a few
          seconds.
        </Text>
        <Button label="Try again" onPress={getData} />
      </RootView>
    );
  }

  return (
    <RootView>
      <PageHeader
        title={t("monthlySummary")}
        bottom={
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>{currentMonth}</Text>
            <Link href="/choose-date" asChild>
              <Pressable style={styles.link}>
                <Text style={styles.linkText}>{t("changeMonth")}</Text>
                <SimpleLineIcons
                  name="arrow-right"
                  color={styles.icon.color}
                  size={styles.icon.height}
                />
              </Pressable>
            </Link>
          </View>
        }
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("totalIncome")}</Text>
        <View style={styles.cardContent}>
          <Text style={styles.cardAmount}>{totalIncome}</Text>
          <Text style={styles.cardCurrency}>AED</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("totalExpenses")}</Text>
        <View style={styles.cardContent}>
          <Text style={styles.cardAmount}>{totalExpenses}</Text>
          <Text style={styles.cardCurrency}>AED</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("totalProfit")}</Text>
        <View style={styles.cardContent}>
          <Text style={styles.cardAmount}>{totalProfit}</Text>
          <Text style={styles.cardCurrency}>AED</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Button onPress={onShare} label={t("shareByWS")} />
        <Link href="/daily-summary" asChild dismissTo>
          <Button label={t("dailySummary")} variant="secondary" />
        </Link>
      </View>
    </RootView>
  );
};

export default MonthlySummary;

const styles = StyleSheet.create((theme, miniRuntime) => ({
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
    fontSize: 12,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.divider,
    gap: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: miniRuntime.screen.width <= 640 ? 12 : 14,
    color: theme.colors.body2,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  linkText: {
    fontFamily: "Inter-Light",
    fontSize: miniRuntime.screen.width <= 640 ? 12 : 14,
    color: theme.colors.accent,
  },
  cardContent: {
    gap: 6,
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: theme.colors.card,
  },
  cardAmount: {
    fontFamily: "Poppins-Light",
    fontSize: 36,
  },
  cardCurrency: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  buttonsContainer: {
    gap: 8,
    width: "100%",
  },
  income: (value: number) => ({
    color: value >= 0 ? theme.colors.gaining : theme.colors.losing,
  }),
  icon: {
    color: theme.colors.accent,
    height: miniRuntime.screen.width <= 640 ? 12 : 16,
  },
}));
