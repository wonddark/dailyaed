import React, { useEffect, useState } from "react";
import { Text, TextInput } from "@/components/themed";
import Button from "@/components/button";
import { StyleSheet } from "react-native-unistyles";
import { Link, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Controller, useForm } from "react-hook-form";
import { InlineAlert, RootView, View, WrapperView } from "@/components/views";
import { Platform } from "react-native";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const SignUp = () => {
  const { t } = useTranslation();
  const { replace } = useRouter();
  const [error, setError] = useState(false);
  const methods = useForm({
    defaultValues: {
      identifier: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        identifier: yup.string().required(t("requiredField")),
        password: yup.string().required(t("requiredField")),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref("password")], t("passwordMustMatch"))
          .required(t("requiredField")),
      }),
    ),
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    setError(false);
    const response = await supabase.auth.signUp({
      ...(data.identifier.includes("@")
        ? { email: data.identifier }
        : { phone: data.identifier }),
      password: data.password,
    });
    if (response.error) {
      console.log(response.error);
      setError(true);
    } else {
      replace("/daily-summary");
    }
  });

  useEffect(() => {
    if (Platform.OS === "web" && document !== undefined) {
      document.title = "Sign Up - DailyAED";
    }
  }, []);

  return (
    <RootView>
      <WrapperView>
        <PageHeader
          title={t("signUp")}
          subtitle={t("signUpBenefit")}
          sideAction={false}
        />

        <View style={styles.formContainer}>
          <View style={styles.formFields}>
            {error ? <InlineAlert message={t("errorTryAgain")} /> : null}
            <Controller
              control={methods.control}
              name="identifier"
              render={({ field, fieldState: { invalid, error } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder={t("phoneOrEmail")}
                    value={field.value}
                    onChangeText={field.onChange}
                  />
                  {invalid ? (
                    <Text style={styles.helperText}>{error?.message}</Text>
                  ) : null}
                </View>
              )}
            />

            <Controller
              control={methods.control}
              name="password"
              render={({ field, fieldState: { invalid, error } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={field.value}
                    onChangeText={field.onChange}
                    secureTextEntry
                    placeholder="Password"
                  />
                  {invalid ? (
                    <Text style={styles.helperText}>{error?.message}</Text>
                  ) : null}
                </View>
              )}
            />

            <Controller
              control={methods.control}
              name="confirmPassword"
              render={({ field, fieldState: { invalid, error } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={field.value}
                    onChangeText={field.onChange}
                    secureTextEntry
                    placeholder="Confirm password"
                  />
                  {invalid ? (
                    <Text style={styles.helperText}>{error?.message}</Text>
                  ) : null}
                </View>
              )}
            />
          </View>

          <View style={styles.formActions}>
            <Button
              label={t("start")}
              onPress={onSubmit}
              disabled={methods.formState.isSubmitting}
              loading={methods.formState.isSubmitting}
            />
            <Link href="/sign-in" asChild>
              <Button label="Sign In" variant="ghost" />
            </Link>
          </View>
        </View>
      </WrapperView>
    </RootView>
  );
};

export default SignUp;

const styles = StyleSheet.create((theme, miniRuntime) => ({
  formContainer: {
    width: "100%",
    maxWidth: 540,
    gap: 24,
  },
  formFields: {
    gap: 12,
  },
  formActions: {
    gap: 12,
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
