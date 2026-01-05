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
import PageHeader from "@/components/PageHeader";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const EditIncome = () => {
  const { replace } = useRouter();
  const { t } = useTranslation();
  const [status, setStatus] = useState<{ loading: boolean; error: boolean }>({
    loading: true,
    error: false,
  });
  const methods = useForm({
    defaultValues: {
      id: "",
      income: 0,
      expenses: 0,
    },
    resolver: yupResolver(
      yup.object().shape({
        id: yup.string(),
        income: yup
          .number()
          .positive(t("positiveValueExpected"))
          .required(t("requiredField")),
        expenses: yup.number().required(),
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
      methods.setValue("income", response.data[0].income);
      methods.setValue("expenses", response.data[0].expenses);
    }
    setStatus({ loading: false, error: response.error !== null });
  };

  const onSave = methods.handleSubmit(async (data) => {
    let response;
    if (data.id === "") {
      response = await supabase.from("records").insert({
        income: data.income,
        profit: data.income,
        date: new Date().toISOString(),
      });
    } else {
      response = await supabase
        .from("records")
        .update({
          income: data.income,
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
      document.title = "Edit Income - DailyAED";
    }
    getStoreData().finally();
  }, []);

  if (status.loading) {
    return (
      <RootView style={styles.rootLoading}>
        <ActivityIndicator size="large" color={styles.loader.color} />
      </RootView>
    );
  }

  if (!methods.formState.isSubmitted && status.error) {
    return (
      <RootView>
        <InlineAlert message="There was an error when loading the data. Please try in a few seconds." />
        <Button label={t("tryAgain")} onPress={getStoreData} />
      </RootView>
    );
  }

  return (
    <RootView>
      <PageHeader
        title={t("editIncome")}
        subtitle={dayjs().format("MMM DD")}
        sideAction={false}
      />

      {status.error ? (
        <InlineAlert message="There was an error when saving the income. We will try again later." />
      ) : null}
      <Controller
        control={methods.control}
        name="income"
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
        <Button
          label={t("saveIncome")}
          onPress={onSave}
          loading={methods.formState.isSubmitting}
          disabled={methods.formState.isSubmitting}
        />
        <Link href="/daily-summary" asChild replace>
          <Button label={t("cancel")} variant="ghost" />
        </Link>
      </View>
    </RootView>
  );
};

export default EditIncome;

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
    fontFamily: "Inter",
  },
  dateLabel: {
    opacity: 0.55,
    fontSize: 12,
  },
  buttonsContainer: {
    gap: 8,
  },
  rootLoading: {
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    color: theme.colors.body2,
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
