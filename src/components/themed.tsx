import {
  Text as DefaultText,
  TextInput as DefaultTextInput
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { appThemes, breakpoints, settings } from "@/lib/unistyles";

StyleSheet.configure({
  themes: appThemes,
  breakpoints,
  settings,
});

type TextProps = DefaultText["props"];
function Text({ children, ...props }: Readonly<TextProps>) {
  return (
    <DefaultText {...props} style={[styles.text, props.style]}>
      {children}
    </DefaultText>
  );
}

type TextInputProps = DefaultTextInput["props"];
function TextInput({ children, style, ...props }: Readonly<TextInputProps>) {
  return (
    <DefaultTextInput
      style={[styles.textInput(Boolean(props.multiline)), style]}
      {...props}
      placeholderTextColor={styles.placeholder.color}
    >
      {children}
    </DefaultTextInput>
  );
}

const styles = StyleSheet.create((theme, miniRuntime) => ({
  text: {
    color: theme.colors.body,
    fontFamily: "Inter",
  },
  textInput: (multiline: boolean) => ({
    fontFamily: "Poppins",
    fontSize: {
      xs: 13,
      lg: 15,
    },
    padding: {
      xs: 12,
      lg: 10,
    },
    height: {
      xs: multiline ? 85 : "auto",
      lg: multiline ? 90 : "auto",
    },
    color: theme.colors.body,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.inputBorder,
    borderRadius: {
      xs: 8,
      lg: 8,
    },
    textAlignVertical: "center",
    verticalAlign: multiline ? "top" : "middle",
  }),
  placeholder: {
    color: theme.colors.muted,
  },
}));

export { Text, TextInput };
