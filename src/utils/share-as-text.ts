function generateWSLink({
  income,
  expenses,
  profit,
  date,
  daily = true,
}: {
  income: number;
  expenses: number;
  profit: number;
  date: string;
  daily?: boolean;
}) {
  const msg = daily
    ? `*Daily Resume*\n_${date}_\n\nIncome: *${income}AED*\nExpenses: *${expenses}AED*\nProfit: *${profit}AED*\n\nUsing DailyAED app`
    : `*Monthly Resume*\n_${date}_\n\nIncome: *${income}AED*\nExpenses: *${expenses}AED*\nProfit: *${profit}AED*\n\nUsing DailyAED app`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

export { generateWSLink };
