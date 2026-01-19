import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { ReactNode } from "react";

type ButtonProps = Omit<PressableProps, "children"> & {
  label?: string;
  variant?: "secondary" | "ghost" | "link";
  size?: "small" | "large";
  loading?: boolean;
  icon?: ReactNode;
};

function Button({ label, ...props }: Readonly<ButtonProps>) {
  const { variant, size, loading, icon } = props;

  styles.useVariants({
    color: variant,
    size: size,
  });

  return (
    <Pressable
      {...props}
      style={[styles.button(Boolean(props.disabled)), props.style as ViewStyle]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={styles.loader.color} />
      ) : null}
      <Text style={styles.text}>{label}</Text>
      {icon}
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create((theme, miniRuntime) => ({
  button: (disabled: boolean) => ({
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    variants: {
      size: {
        small: {
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 6,
          gap: 4,
          width: "auto",
          alignSelf: "flex-start",
        },
        large: {
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 10,
          gap: 12,
        },
        default: {
          borderRadius: { xs: 8, lg: 12 },
          paddingVertical: { xs: 12, lg: 10 },
          paddingHorizontal: { xs: 24, lg: 20 },
          gap: {
            xs: 4,
            lg: 6,
          },
        },
      },
      color: {
        secondary: {
          backgroundColor: theme.colors.secondary,
        },
        ghost: {},
        link: {
          paddingHorizontal: 0,
        },
        default: {
          backgroundColor: theme.colors.primary,
          ...(disabled ? { opacity: 0.75 } : {}),
        },
      },
    },
  }),
  text: {
    fontFamily: "Inter",
    fontWeight: 600,
    variants: {
      color: {
        secondary: {
          color: theme.colors.secondaryContrast,
        },
        ghost: {
          color: theme.colors.primary,
        },
        link: {
          color: theme.colors.primary,
        },
        default: {
          color: theme.colors.primaryContrast,
        },
      },
      size: {
        small: {
          fontSize: { xs: 12, lg: 14 },
        },
        large: {
          fontSize: { xs: 16, lg: 18 },
        },
        default: {
          fontSize: {
            xs: 12,
            lg: 14,
          },
        },
      },
    },
  },
  loader: { color: theme.colors.body2 },
}));
