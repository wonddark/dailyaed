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
import ButtonsContainer from "@/components/ButtonsContainer";

export default function SignIn() {
  const { t } = useTranslation();
  const { replace } = useRouter();
  const [error, setError] = useState<boolean>(false);

  const methods = useForm({
    defaultValues: {
      identifier: "",
      password: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        identifier: yup.string().required(t("requiredField")),
        password: yup.string().required(t("requiredField")),
      }),
    ),
  });

  const onSignIn = methods.handleSubmit(async (data) => {
    setError(false);
    const response = await supabase.auth.signInWithPassword({
      ...(data.identifier.includes("@")
        ? { email: data.identifier }
        : { phone: data.identifier }),
      password: data.password,
    });
    if (response.error) {
      setError(true);
    } else {
      replace("/daily-summary");
    }
  });

  useEffect(() => {
    if (Platform.OS === "web" && document !== undefined) {
      document.title = "Sign In - DailyAED";
    }
  }, []);

  return (
    <RootView>
      <WrapperView>
        <PageHeader
          title={t("signIn")}
          subtitle={t("signInBenefit")}
          sideAction={false}
        />

        <View style={styles.formContainer}>
          {error ? <InlineAlert message={t("wrongCredentials")} /> : null}
          <View style={styles.formFields}>
            <Controller
              control={methods.control}
              name="identifier"
              render={({ field, fieldState: { invalid, error } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={field.value}
                    onChangeText={field.onChange}
                    placeholder={t("phoneOrEmail")}
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
                    placeholder="********"
                    secureTextEntry
                  />
                  {invalid ? (
                    <Text style={styles.helperText}>{error?.message}</Text>
                  ) : null}
                </View>
              )}
            />
          </View>

          <ButtonsContainer>
            <Button
              label={t("enter")}
              onPress={onSignIn}
              disabled={methods.formState.isSubmitting}
              loading={methods.formState.isSubmitting}
              style={styles.wideButton}
            />
            <Link href="/sign-up" asChild dismissTo>
              <Button
                label={t("signUp")}
                variant="outlined"
                rightIcon="arrow-right-long"
              />
            </Link>
          </ButtonsContainer>
        </View>
      </WrapperView>
    </RootView>
  );
}

const styles = StyleSheet.create((theme, miniRuntime) => ({
  formContainer: {
    gap: {
      xs: 32,
      lg: 40,
    },
    maxWidth: 480,
  },
  formFields: {
    gap: {
      xs: 12,
      lg: 24,
    },
  },
  inputWrapper: {
    gap: {
      xs: 4,
      lg: 8,
    },
  },
  helperText: {
    color: theme.colors.losing,
    fontSize: miniRuntime.screen.width <= 640 ? 12 : 14,
    fontWeight: 500,
  },
  wideButton: {
    flex: 1,
  },
}));
