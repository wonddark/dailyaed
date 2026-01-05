import React, { useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import { RootView } from "@/components/views";
import PageHeader from "@/components/PageHeader";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { Link, useRouter } from "expo-router";
import Button from "@/components/button";

const Settings = () => {
  const { t } = useTranslation();
  const { dismissTo } = useRouter();
  const [status, setStatus] = useState<{ loading: boolean; error: boolean }>({
    loading: false,
    error: false,
  });

  const onSignOut = async () => {
    setStatus({ loading: true, error: false });
    const response = await supabase.auth.signOut();

    const success = response.error === null;

    setStatus({ loading: false, error: !success });

    if (success) {
      dismissTo("/");
    }
  };

  return (
    <RootView>
      <PageHeader
        title={t("settings")}
        subtitle={t("settingsSubtitle")}
        sideAction={false}
      />
      <Button
        onPress={onSignOut}
        label={t("signOut")}
        loading={status.loading}
      />
      <Link href="/daily-summary" asChild dismissTo>
        <Button label={t("backToSummary")} variant="ghost" />
      </Link>
    </RootView>
  );
};
export default Settings;
const styles = StyleSheet.create(() => ({}));
