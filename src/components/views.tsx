import { View as DefaultView } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Text } from "@/components/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ViewProps = DefaultView["props"];
function View({
  children,
  center,
  ...props
}: Readonly<ViewProps & { center?: "vertical" | "horizontal" | "all" }>) {
  styles.useVariants({ center });
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

function WrapperView({ style, ...props }: Readonly<ViewProps>) {
  return <View style={[styles.wrapper, style]} {...props} />;
}

type InlineAlertProps = Omit<ViewProps, "children"> & { message: string };
function InlineAlert({ message, ...props }: Readonly<InlineAlertProps>) {
  return (
    <View {...props} style={styles.inlineAlert}>
      <Text style={styles.inlineAlertMessage}>{message}</Text>
    </View>
  );
}

export { View, RootView, WrapperView, InlineAlert };

const styles = StyleSheet.create((theme, miniRuntime) => ({
  root: {
    flex: 1,
    gap: 16,
  },
  wrapper: {
    maxWidth: 1200,
    marginHorizontal: "auto",
    flex: 1,
    width: "100%",
  },
  view: {
    backgroundColor: theme.colors.background,
    variants: {
      center: {
        vertical: {
          justifyContent: "center",
          height: "100%",
        },
        horizontal: {
          alignItems: "center",
          width: "100%",
        },
        all: {
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        },
      },
    },
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
