import React, { useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import { RootView, WrapperView } from "@/components/views";
import PageHeader from "@/components/PageHeader";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { Link, useRouter } from "expo-router";
import Button from "@/components/button";
import ButtonsContainer from "@/components/ButtonsContainer";

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
      <WrapperView>
        <PageHeader
          title={t("settings")}
          subtitle={t("settingsSubtitle")}
          sideAction={false}
        />
        <ButtonsContainer>
          <Link href="/daily-summary" asChild dismissTo>
            <Button
              label={t("back")}
              leftIcon="arrow-left-long"
              variant="outlined"
            />
          </Link>
          <Button
            onPress={onSignOut}
            label={t("signOut")}
            loading={status.loading}
            style={styles.longButton}
          />
        </ButtonsContainer>
      </WrapperView>
    </RootView>
  );
};

export default Settings;

const styles = StyleSheet.create(() => ({
  longButton: {
    flex: 1,
  },
}));
