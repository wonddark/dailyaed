import React, { useEffect, useState } from "react";
import { Text, TextInput } from "@/components/themed";
import { StyleSheet } from "react-native-unistyles";
import { InlineAlert, RootView, View } from "@/components/views";
import { Link, useRouter } from "expo-router";
import Button from "@/components/button";
import { Controller, useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { ActivityIndicator, Platform } from "react-native";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";

const EditExpenses = () => {
  const { t } = useTranslation();
  const { replace } = useRouter();
  const [status, setStatus] = useState<{ loading: boolean; error: boolean }>({
    loading: true,
    error: false,
  });
  const methods = useForm({
    defaultValues: {
      id: "",
      expenses: 0,
      income: 0,
    },
    resolver: yupResolver(
      yup.object().shape({
        id: yup.string(),
        expenses: yup
          .number()
          .positive(t("positiveValueExpected"))
          .required(t("requiredField")),
        income: yup.number().required(),
      }),
    ),
  });

  const getStoreData = async () => {
    setStatus({ loading: true, error: false });
    const response = await supabase
      .from("records")
      .select("*")
      .eq("date", dayjs().format("YYYY-MM-DD"));

    if (response.data && response.data.length > 0) {
      methods.setValue("id", response.data[0].id);
      methods.setValue("expenses", response.data[0].expenses);
      methods.setValue("income", response.data[0].income);
    }
    setStatus({ loading: false, error: response.error !== null });
  };

  const onSave = methods.handleSubmit(async (data) => {
    let response;
    if (data.id === "") {
      response = await supabase.from("records").insert({
        expenses: data.expenses,
        profit: data.income - data.expenses,
        date: new Date().toISOString(),
      });
    } else {
      response = await supabase
        .from("records")
        .update({
          expenses: data.expenses,
          profit: data.income - data.expenses,
        })
        .match({ id: data.id });
    }
    if (response.error) {
      setStatus((prevState) => ({ ...prevState, error: true }));
    } else {
      replace("/daily-summary");
    }
  });

  useEffect(() => {
    if (Platform.OS === "web" && document !== undefined) {
      document.title = "Edit Expenses - DailyAED";
    }
    getStoreData().finally();
  }, []);

  if (status.loading) {
    return (
      <RootView>
        <ActivityIndicator size="large" />
      </RootView>
    );
  }

  if (!methods.formState.isSubmitted && status.error) {
    return (
      <RootView>
        <InlineAlert message="There was an error when loading the data. Please try in a few seconds." />
        <Button label="Try again" onPress={getStoreData} />
      </RootView>
    );
  }

  return (
    <RootView>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Edit Expenses</Text>
        <Text style={styles.dateLabel}>Today - Jan 02</Text>
      </View>
      {status.error ? (
        <InlineAlert message="There was an error when saving the expenses. We will try again later." />
      ) : null}
      <Controller
        control={methods.control}
        name="expenses"
        render={({ field, fieldState: { invalid, error } }) => (
          <View style={styles.inputWrapper}>
            <TextInput
              value={`${field.value}`}
              onChangeText={(txt) => {
                if (
                  (!txt.endsWith(".") || !txt.endsWith(",")) &&
                  !isNaN(Number(txt))
                ) {
                  field.onChange(txt);
                }
              }}
            />
            {invalid ? (
              <Text style={styles.helperText}>{error?.message}</Text>
            ) : null}
          </View>
        )}
      />
      <View style={styles.buttonsContainer}>
        <Button label="Save Expenses" onPress={onSave} />
        <Link href="/daily-summary" asChild replace>
          <Button label="Cancel" variant="ghost" />
        </Link>
      </View>
    </RootView>
  );
};

export default EditExpenses;

const styles = StyleSheet.create((theme, miniRuntime) => ({
  headerContainer: {
    alignItems: "flex-start",
    width: "100%",
    gap: 2,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 300,
  },
  dateLabel: {
    opacity: 0.55,
    fontSize: 12,
  },
  buttonsContainer: {
    gap: 8,
  },
  inputWrapper: {
    gap: 2,
  },
  helperText: {
    color: theme.colors.losing,
    fontSize: miniRuntime.screen.width <= 640 ? 12 : 14,
    fontWeight: 500,
  },
}));
