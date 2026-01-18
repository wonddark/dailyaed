import { View } from "@/components/views";
import { StyleSheet } from "react-native-unistyles";
import { ViewProps } from "react-native";

const ButtonsContainer = ({ style, ...props }: Readonly<ViewProps>) => {
  return <View style={[styles.buttonsContainer, style]} {...props} />;
};

export default ButtonsContainer;

const styles = StyleSheet.create(() => ({
  buttonsContainer: {
    gap: {
      xs: 8,
      lg: 6,
    },
    flexDirection: {
      xs: "column",
      lg: "row",
    },
  },
}));
