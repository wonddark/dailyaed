import React from "react";
import { StyleSheet } from "react-native-unistyles";
import { Link } from "expo-router";
import Button from "@/components/button";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const HeaderSettingsBtn = () => {
  return (
    <Link href="/settings" asChild>
      <Button
        variant="ghost"
        icon={
          <SimpleLineIcons
            name="settings"
            color={styles.icon.color}
            size={styles.icon.height}
          />
        }
      />
    </Link>
  );
};

export default HeaderSettingsBtn;

const styles = StyleSheet.create((theme, miniRuntime) => ({
  icon: {
    color: theme.colors.body2,
    height: miniRuntime.screen.width <= 640 ? 20 : 24,
  },
}));
