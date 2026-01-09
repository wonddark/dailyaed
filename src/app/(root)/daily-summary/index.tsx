import React, { useCallback, useEffect, useState } from "react";
import { Text } from "@/components/themed";
import Button from "@/components/button";
import { StyleSheet } from "react-native-unistyles";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { RootView, View } from "@/components/views";
import { ActivityIndicator, Linking, Platform, Pressable } from "react-native";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import { generateWSLink } from "@/utils/share-as-text";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const DailySummary = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";
  const { date } = useLocalSearchParams();
  const [data, setData] = useState<{
    income: number;
    expenses: number;
    profit: number;
  }>({
    income: 0,
    expenses: 0,
    profit: 0,
  });
  const [status, setStatus] = useState<{ loading: boolean; error: boolean }>({
    loading: true,
    error: false,
  });
  const currentDate = dayjs(date as string | undefined).format("MMM DD");

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
    Linking.openURL(link);
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
        <Button label="Try again" onPress={getStoredData} />
      </RootView>
    );
  }

  return (
    <RootView>
      <PageHeader
        title={t("summary")}
        bottom={
          <View style={styles.dateContainer}>
            <Text
              style={styles.dateLabel}
            >{`${t("today")} - ${currentDate}`}</Text>
            <Link href="/choose-date?pickDay=true" asChild>
              <Pressable style={styles.link}>
                <Text style={styles.linkText}>{t("changeDate")}</Text>
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
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{t("todayIncome")}</Text>
          <Link href="/edit-income" asChild>
            <Pressable style={styles.link}>
              <Text style={styles.linkText}>{t("editIncome")}</Text>
              <SimpleLineIcons
                name="arrow-right"
                color={styles.icon.color}
                size={styles.icon.height}
              />
            </Pressable>
          </Link>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardAmount}>
            {Intl.NumberFormat(locale, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(data.income)}
          </Text>
          <Text style={styles.cardCurrency}>AED</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{t("todayExpenses")}</Text>
          <Link href="/edit-expenses" asChild>
            <Pressable style={styles.link}>
              <Text style={styles.linkText}>{t("editExpenses")}</Text>
              <SimpleLineIcons
                name="arrow-right"
                color={styles.icon.color}
                size={styles.icon.height}
              />
            </Pressable>
          </Link>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardAmount}>
            {Intl.NumberFormat(locale, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(data.expenses)}
          </Text>
          <Text style={styles.cardCurrency}>AED</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("todayProfit")}</Text>
        <View style={styles.cardContent}>
          <Text style={[styles.cardAmount, styles.income(data.profit)]}>
            {Intl.NumberFormat(locale, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(data.profit)}
          </Text>
          <Text style={styles.cardCurrency}>AED</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Button onPress={onShare} label={t("shareByWS")} />
        <Link href="/monthly-summary" asChild>
          <Button label={t("monthlySummary")} variant="secondary" />
        </Link>
      </View>
    </RootView>
  );
};

export default DailySummary;

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
    backgroundColor: theme.colors.card,
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
