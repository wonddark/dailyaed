import React, { useCallback, useEffect, useState } from "react";
import { Text } from "@/components/themed";
import Button from "@/components/button";
import { StyleSheet } from "react-native-unistyles";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { RootView, View, WrapperView } from "@/components/views";
import { ActivityIndicator, Linking, Platform, Pressable } from "react-native";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import { generateWSLink } from "@/utils/share-as-text";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome6";
import ButtonsContainer from "@/components/ButtonsContainer";
import SummaryCard from "@/components/SummaryCard";
import SummaryCardsContainer from "@/components/summary-cards-container";

const DailySummary = () => {
  const { t } = useTranslation();
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
              >{`${t("today")} - ${currentDate}`}</Text>
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
          />
          <SummaryCard
            title={t("todayProfit")}
            amount={data.profit}
            big
            amountContext
          />
        </SummaryCardsContainer>

        <ButtonsContainer>
          <Button onPress={onShare} label={t("shareByWS")} />
          <Link href="/monthly-summary" asChild>
            <Button label={t("monthlySummary")} variant="secondary" />
          </Link>
        </ButtonsContainer>
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
}));
