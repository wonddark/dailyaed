import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import FontAwesomeIcon from "@expo/vector-icons/FontAwesome6";

type ButtonProps = Omit<PressableProps, "children"> & {
  label?: string;
  variant?: "secondary" | "ghost" | "link" | "outlined";
  size?: "small" | "large" | "icon";
  loading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
};

function Button({ label, ...props }: Readonly<ButtonProps>) {
  const { variant, size, loading, leftIcon, rightIcon } = props;

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

      {leftIcon && !loading ? (
        <FontAwesomeIcon
          name={leftIcon}
          color={styles.icon.color}
          size={styles.icon.height}
        />
      ) : null}

      {label ? <Text style={styles.text}>{label}</Text> : null}

      {rightIcon ? (
        <FontAwesomeIcon
          name={rightIcon}
          color={styles.icon.color}
          size={styles.icon.height}
        />
      ) : null}
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
        icon: {
          padding: {
            xs: 6,
            lg: 10,
          },
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
        outlined: {
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: theme.colors.muted,
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
          color: theme.colors.body2,
        },
        link: {
          color: theme.colors.primary,
        },
        outlined: {
          color: theme.colors.muted,
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
        icon: {},
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
  icon: {
    variants: {
      color: {
        secondary: {
          color: theme.colors.secondaryContrast,
        },
        ghost: {
          color: theme.colors.body2,
        },
        link: {
          color: theme.colors.primary,
        },
        outlined: {
          color: theme.colors.muted,
        },
        default: {
          color: theme.colors.primaryContrast,
        },
      },
      size: {
        small: {
          height: { xs: 12, lg: 14 },
        },
        large: {
          height: { xs: 16, lg: 18 },
        },
        icon: {
          height: {
            xs: 20,
            lg: 24,
          },
        },
        default: {
          height: {
            xs: 15,
            lg: 17,
          },
        },
      },
    },
  },
}));
