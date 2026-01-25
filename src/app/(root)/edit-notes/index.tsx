import React, { useCallback, useEffect, useState } from "react";
import { Text, TextInput } from "@/components/themed";
import Button from "@/components/button";
import { StyleSheet } from "react-native-unistyles";
import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { RootView, View, WrapperView } from "@/components/views";
import { ActivityIndicator, Platform, Pressable } from "react-native";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome6";
import ButtonsContainer from "@/components/ButtonsContainer";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const EditNotes = () => {
  const { t } = useTranslation();
  const { dismissTo } = useRouter();
  const { date } = useLocalSearchParams();
  const [status, setStatus] = useState<{ loading: boolean; error: boolean }>({
    loading: true,
    error: false,
  });
  const isToday = dayjs().isSame(date as string | undefined, "day");
  const currentDate = dayjs(date as string | undefined).format(
    isToday ? "MMM DD" : "ddd, MMM DD",
  );

  const methods = useForm({
    defaultValues: {
      notes: "",
    },
    resolver: yupResolver(
      yup.object({
        notes: yup.string().max(200),
      }),
    ),
  });

  const getStoredData = async () => {
    setStatus({ loading: true, error: false });
    const response = await supabase
      .from("records")
      .select("notes")
      .eq("date", date ?? dayjs().format("YYYY-MM-DD"));
    if (response.data) {
      methods.setValue("notes", response.data[0]?.notes ?? "");
    }
    setStatus({ loading: false, error: response.error !== null });
  };

  const onSubmit = methods.handleSubmit(async (data) => {
    const response = await supabase
      .from("records")
      .update({ notes: data.notes })
      .eq("date", date ?? dayjs().format("YYYY-MM-DD"));

    setStatus({ loading: false, error: response.error !== null });

    if (response.error === null) {
      dismissTo(`/daily-notes?date=${date}`);
    }
  });

  useEffect(() => {
    if (Platform.OS === "web" && document !== undefined) {
      document.title = "Edit Notes- DailyAED";
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
          title={t("editNotes")}
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

        <Controller
          control={methods.control}
          name="notes"
          render={({ field, fieldState: { invalid, error } }) => (
            <View>
              <TextInput
                multiline
                value={field.value}
                onChangeText={field.onChange}
              />
              {invalid ? (
                <Text style={styles.errorHint}>{error?.message}</Text>
              ) : null}
            </View>
          )}
        />

        <ButtonsContainer>
          <Link href="/daily-summary" asChild dismissTo>
            <Button
              leftIcon="arrow-left-long"
              label={t("back")}
              variant="outlined"
            />
          </Link>
          <Button
            onPress={onSubmit}
            label={t("save")}
            style={styles.wideButton}
            loading={methods.formState.isSubmitting}
            disabled={methods.formState.isSubmitting}
          />
        </ButtonsContainer>
      </WrapperView>
    </RootView>
  );
};

export default EditNotes;

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
  errorHint: {
    color: theme.colors.losing,
    fontSize: {
      xs: 12,
      lg: 14,
    },
  },
}));
