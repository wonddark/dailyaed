import React from "react";
import { StyleSheet } from "react-native-unistyles";
import { View } from "@/components/views";
import { Text } from "@/components/themed";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import FontAwesomeIcon from "@expo/vector-icons/FontAwesome6";
import { useTranslation } from "react-i18next";

type Props = {
  title: string;
  actionRoute?: string;
  actionIcon?: string;
  actionLabel?: string;
  amount: number;
  amountContext?: boolean;
  big?: boolean;
  notes?: string;
  notesDate?: string;
};

const SummaryCard = (props: Readonly<Props>) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";
  const {
    title,
    actionRoute,
    actionIcon,
    actionLabel,
    amount,
    amountContext,
    big,
    notes,
    notesDate,
  } = props;

  if (notes && notes !== "" && !notesDate)
    throw new Error("A date must be provided for notes.");

  return (
    <View style={[styles.card, big ? styles.bigCard : {}]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>

        <View style={styles.cardHeaderLinks}>
          {notes && notesDate ? (
            <Link href={`/daily-notes?date=${notesDate}`} asChild>
              <Pressable style={styles.link}>
                <FontAwesomeIcon
                  name="file-lines"
                  color={styles.icon.color}
                  size={styles.icon.height}
                />
                <Text style={styles.linkText}>{t("seeNotes")}</Text>
              </Pressable>
            </Link>
          ) : null}
          {actionRoute ? (
            <Link href={actionRoute} asChild>
              <Pressable style={styles.link}>
                {actionIcon ? (
                  <FontAwesomeIcon
                    name={actionIcon}
                    color={styles.icon.color}
                    size={styles.icon.height}
                  />
                ) : null}
                {actionLabel ? (
                  <Text style={styles.linkText}>{actionLabel}</Text>
                ) : null}
              </Pressable>
            </Link>
          ) : null}
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text
          style={[
            styles.cardAmount,
            amountContext ? styles.income(amount) : {},
          ]}
        >
          {Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(amount)}
        </Text>
        <Text style={styles.cardCurrency}>AED</Text>
      </View>
    </View>
  );
};
export default SummaryCard;
const styles = StyleSheet.create((theme) => ({
  card: {
    padding: 24,
    borderRadius: 10,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.divider,
    gap: {
      xs: 6,
      lg: 10,
    },
    flex: {
      xs: undefined,
      lg: 1,
    },
  },
  bigCard: {
    width: "100%",
    flex: undefined,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.card,
  },
  cardTitle: {
    fontSize: {
      xs: 12,
      lg: 16,
    },
    color: theme.colors.body2,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  linkText: {
    fontFamily: "Inter-Light",
    fontSize: {
      xs: 12,
      lg: 16,
    },
    color: theme.colors.accent,
  },
  icon: {
    color: theme.colors.accent,
    height: {
      xs: 12,
      lg: 14,
    },
  },
  cardContent: {
    gap: 6,
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: theme.colors.card,
  },
  cardAmount: {
    fontFamily: "Poppins-Light",
    fontSize: {
      xs: 40,
      lg: 60,
    },
    lineHeight: {
      xs: theme.lineHeight(40, 1.1),
      lg: theme.lineHeight(60, 1.1),
    },
  },
  cardCurrency: {
    fontSize: { xs: 14, lg: 16 },
    color: theme.colors.muted,
    lineHeight: {
      xs: theme.lineHeight(14, 1.5),
      lg: theme.lineHeight(16, 1.5),
    },
  },
  income: (value: number) => ({
    color: value >= 0 ? theme.colors.gaining : theme.colors.losing,
  }),
  cardHeaderLinks: {
    backgroundColor: theme.colors.card,
    flexDirection: "row",
    gap: {
      xs: 12,
      lg: 20,
    },
  },
}));
