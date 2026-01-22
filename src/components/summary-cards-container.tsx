import { ReactNode } from "react";
import { View } from "@/components/views";
import { StyleSheet } from "react-native-unistyles";

type Props = {
  children: ReactNode;
};

const SummaryCardsContainer = (props: Readonly<Props>) => {
  const { children } = props;
  return <View style={styles.cardsContainer}>{children}</View>;
};

export default SummaryCardsContainer;

const styles = StyleSheet.create(() => ({
  cardsContainer: {
    flexDirection: {
      xs: "column",
      lg: "row",
    },
    flexWrap: {
      xs: undefined,
      lg: "wrap",
    },
    gap: {
      xs: 16,
      lg: 20,
    },
  },
}));
