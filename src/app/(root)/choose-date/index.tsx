import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import { RootView, WrapperView } from "@/components/views";
import { Platform } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/components/button";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import PageHeader from "@/components/PageHeader";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import ButtonsContainer from "@/components/ButtonsContainer";

const ChooseDate = () => {
  const { t, i18n } = useTranslation();
  const { dismiss } = useRouter();
  const { pickDay } = useLocalSearchParams();
  const [selected, setSelected] = useState<Dayjs>(dayjs());

  const onChangeDate = (params: { date: DateType }) => {
    setSelected(dayjs(params.date));
  };

  const onMonthChange = (month: number) => {
    setSelected(dayjs(selected).month(month));
  };

  const onYearChange = (month: number) => {
    setSelected(dayjs(selected).year(month));
  };

  useEffect(() => {
    if (Platform.OS === "web" && document !== undefined) {
      document.title = "Choose a date - DailyAED";
    }
  }, []);

  return (
    <RootView>
      <WrapperView>
        <PageHeader
          title={t("chooseDate")}
          subtitle={t("chooseDateSubtitle")}
          sideAction={false}
        />

        {pickDay ? (
          <DateTimePicker
            mode="single"
            date={selected}
            onChange={onChangeDate}
            onMonthChange={onMonthChange}
            onYearChange={onYearChange}
            styles={styles}
            style={styles.calendar}
            locale={i18n.resolvedLanguage}
            disabledDates={(date) => dayjs(date).isAfter(dayjs(), "day")}
            components={{
              IconNext: (
                <SimpleLineIcons
                  name="arrow-right"
                  size={14}
                  color={styles.button_next_image.color}
                />
              ),
              IconPrev: (
                <SimpleLineIcons
                  name="arrow-left"
                  size={12}
                  color={styles.button_prev_image.color}
                />
              ),
            }}
          />
        ) : (
          <DateTimePicker
            mode="range"
            startDate={selected.date(1)}
            endDate={selected.date(selected.daysInMonth())}
            onMonthChange={onMonthChange}
            onYearChange={onYearChange}
            styles={styles}
            style={styles.calendar}
            locale={i18n.resolvedLanguage}
            disabledDates={(date) => dayjs(date).isAfter(dayjs(), "day")}
            initialView={pickDay ? "day" : "month"}
            components={{
              IconNext: (
                <SimpleLineIcons
                  name="arrow-right"
                  size={14}
                  color={styles.button_next_image.color}
                />
              ),
              IconPrev: (
                <SimpleLineIcons
                  name="arrow-left"
                  size={12}
                  color={styles.button_prev_image.color}
                />
              ),
            }}
          />
        )}

        <ButtonsContainer>
          <Link
            href={
              pickDay
                ? `/daily-summary?date=${selected.format("YYYY-MM-DD")}`
                : `/monthly-summary?date=${selected.format("YYYY-MM")}`
            }
            asChild
            dismissTo
          >
            <Button label={t("apply")} />
          </Link>
          <Button
            onPress={() => dismiss()}
            label={t("cancel")}
            variant="secondary"
          />
        </ButtonsContainer>
      </WrapperView>
    </RootView>
  );
};

export default ChooseDate;

const styles = StyleSheet.create((theme) => ({
  title: {
    fontSize: 24,
    fontWeight: 300,
    marginBottom: 32,
  },
  calendar: {
    marginBottom: 24,
  },
  day_cell: {
    padding: 2,
  },
  day_label: {
    color: theme.colors.body,
  },
  today: {
    borderWidth: 1,
    borderColor: `${theme.colors.primary}37`,
    borderRadius: 8,
  },
  today_label: {
    color: theme.colors.primary,
  },
  month_label: {
    color: theme.colors.body,
    textTransform: "uppercase",
  },
  year_label: {
    color: theme.colors.body,
  },
  month_selector_label: {
    color: theme.colors.body,
    fontWeight: 500,
  },
  year_selector_label: {
    color: theme.colors.body,
    fontWeight: 500,
  },
  selected_label: {
    color: theme.colors.primaryContrast,
    fontWeight: 500,
  },
  selected: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  range_middle: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  range_middle_label: {
    color: theme.colors.primaryContrast,
  },
  range_start_label: {
    color: theme.colors.primaryContrast,
  },
  range_end_label: {
    color: theme.colors.primaryContrast,
  },
  weekdays: {
    paddingVertical: 2,
    marginTop: 4,
    marginBottom: 16,
  },
  weekday_label: {
    fontWeight: 500,
    color: theme.colors.body,
  },
  disabled_label: {
    color: theme.colors.muted,
  },
  button_prev_image: {
    color: theme.colors.body,
    backgroundColor: theme.colors.body,
  },
  button_next_image: {
    color: theme.colors.body,
  },
}));
