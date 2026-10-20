export function calculateSavingsRate(totalIncome, totalExpense) {
  const income = Number(totalIncome);
  const expense = Number(totalExpense);

  if (!Number.isFinite(income) || !Number.isFinite(expense)) {
    throw new Error("Los totales deben ser numéricos.");
  }

  if (income <= 0) {
    return 0;
  }

  const savings = income - expense;
  return Math.round((savings / income) * 10000) / 100;
}
