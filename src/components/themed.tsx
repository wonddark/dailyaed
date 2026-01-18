import {
  Text as DefaultText,
  TextInput as DefaultTextInput,
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
function TextInput({ children, ...props }: Readonly<TextInputProps>) {
  return (
    <DefaultTextInput
      {...props}
      style={[styles.textInput, props.style]}
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
  textInput: {
    fontFamily: "Poppins",
    fontSize: {
      xs: 13,
      lg: 15,
    },
    color: theme.colors.body,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.inputBorder,
    borderRadius: {
      xs: 8,
      lg: 8,
    },
    padding: {
      xs: 12,
      lg: 10,
    },
    textAlignVertical: "center",
  },
  placeholder: {
    color: theme.colors.muted,
  },
}));

export { Text, TextInput };
