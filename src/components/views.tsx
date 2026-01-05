import { View as DefaultView } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Text } from "@/components/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ViewProps = DefaultView["props"];
function View({ children, ...props }: Readonly<ViewProps>) {
  return (
    <DefaultView {...props} style={[styles.view, props.style]}>
      {children}
    </DefaultView>
  );
}

function RootView({ style, ...props }: Readonly<ViewProps>) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
          paddingRight: insets.right + 16,
          paddingLeft: insets.left + 16,
        },
        style,
      ]}
      {...props}
    />
  );
}

type InlineAlertProps = Omit<ViewProps, "children"> & { message: string };
function InlineAlert({ message, ...props }: Readonly<InlineAlertProps>) {
  return (
    <View {...props} style={styles.inlineAlert}>
      <Text style={styles.inlineAlertMessage}>{message}</Text>
    </View>
  );
}

export { View, RootView, InlineAlert };

const styles = StyleSheet.create((theme, miniRuntime) => ({
  root: {
    flex: 1,
    gap: 16,
  },
  view: {
    backgroundColor: theme.colors.background,
  },
  inlineAlert: {
    padding: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#316231",
    borderRadius: 8,
    backgroundColor: "#2b572b",
  },
  inlineAlertMessage: {
    fontSize: miniRuntime.screen.width <= 640 ? 12 : 14,
  },
}));
