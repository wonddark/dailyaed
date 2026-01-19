import React from "react";
import { StyleSheet } from "react-native-unistyles";
import { Link } from "expo-router";
import Button from "@/components/button";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome6";

const HeaderSettingsBtn = () => {
  return (
    <Link href="/settings" asChild>
      <Button
        variant="ghost"
        icon={
          <FontAwesomeIcons
            name="gear"
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
