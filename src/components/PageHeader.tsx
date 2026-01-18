import { ReactNode } from "react";
import { StyleSheet } from "react-native-unistyles";
import { View } from "@/components/views";
import { Text } from "@/components/themed";
import HeaderSettingsBtn from "@/components/HeaderSettingsBtn";

type Props = {
  title: string;
  subtitle?: string;
  sideAction?: boolean;
  bottom?: ReactNode;
};

const PageHeader = (props: Readonly<Props>) => {
  const { title, subtitle, sideAction = true, bottom } = props;
  return (
    <View style={styles.root}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {bottom}
      </View>
      {sideAction ? <HeaderSettingsBtn /> : null}
    </View>
  );
};

export default PageHeader;

const styles = StyleSheet.create((theme) => ({
  root: {
    marginBottom: 32,
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: {
      xs: 24,
      lg: 32,
    },
    fontWeight: 300,
  },
  subtitle: {
    fontSize: {
      xs: 12,
      lg: 14,
    },
    color: theme.colors.muted,
  },
}));
