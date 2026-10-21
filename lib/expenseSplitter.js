// Utility functions for expense splitting, currency formatting, and AI debt simplification

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrFormatterWithDecimals = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

/**
 * Formats a number to Indian Rupee (INR) format using Intl.NumberFormat
 * e.g. ₹1,250, ₹12,500
 */
export function formatINR(amount, includeDecimals = false) {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  const num = Number(amount);
  return (includeDecimals && num % 1 !== 0 ? inrFormatterWithDecimals : inrFormatter).format(num);
}

/**
 * Calculates equal splits among participants with precise penny distribution
 * @param {number} totalAmount - Total expense in INR
 * @param {Array<string>} participantIds - List of user IDs included in split
 * @returns {Array<{ userId: string, amount: number, percentage: number }>}
 */
export function calculateEqualSplit(totalAmount, participantIds) {
  if (!participantIds || participantIds.length === 0 || !totalAmount) {
    return [];
  }

  const count = participantIds.length;
  const baseShare = Math.floor((totalAmount / count) * 100) / 100;
  const totalBase = baseShare * count;
  let remainder = Math.round((totalAmount - totalBase) * 100) / 100;

  const percentage = Math.round((100 / count) * 10) / 10;

  return participantIds.map((userId, index) => {
    let share = baseShare;
    if (remainder > 0.001) {
      share = Math.round((share + 0.01) * 100) / 100;
      remainder = Math.round((remainder - 0.01) * 100) / 100;
    }
    return {
      userId,
      amount: share,
      percentage,
    };
  });
}

/**
 * Validates and formats exact splits
 * @param {number} totalAmount
 * @param {Record<string, number>} amountsMap
 * @returns {{ splits: Array<{ userId: string, amount: number, percentage: number }>, isValid: boolean, diff: number, totalAllocated: number }}
 */
export function calculateExactSplit(totalAmount, amountsMap) {
  const userIds = Object.keys(amountsMap);
  let totalAllocated = 0;
  const splits = [];

  userIds.forEach((userId) => {
    const amt = Number(amountsMap[userId]) || 0;
    totalAllocated += amt;
    splits.push({
      userId,
      amount: amt,
      percentage: totalAmount > 0 ? Math.round((amt / totalAmount) * 1000) / 10 : 0,
    });
  });

  const diff = Math.round((totalAmount - totalAllocated) * 100) / 100;
  const isValid = Math.abs(diff) < 0.01 && totalAmount > 0;

  return {
    splits,
    isValid,
    diff,
    totalAllocated,
  };
}

/**
 * Calculates splits by percentage
 * @param {number} totalAmount
 * @param {Record<string, number>} percentMap
 * @returns {{ splits: Array<{ userId: string, amount: number, percentage: number }>, isValid: boolean, diff: number, totalPercentage: number }}
 */
export function calculatePercentageSplit(totalAmount, percentMap) {
  const userIds = Object.keys(percentMap);
  let totalPercentage = 0;
  const splits = [];

  userIds.forEach((userId) => {
    const pct = Number(percentMap[userId]) || 0;
    totalPercentage += pct;
    const share = Math.round(((totalAmount * pct) / 100) * 100) / 100;
    splits.push({
      userId,
      amount: share,
      percentage: pct,
    });
  });

  const diff = Math.round((100 - totalPercentage) * 10) / 10;
  const isValid = Math.abs(diff) < 0.1 && totalAmount > 0;

  return {
    splits,
    isValid,
    diff,
    totalPercentage,
  };
}

/**
 * AI Debt Simplifier Algorithm (Minimizing transaction count across group)
 * Resolves net balance graph so roommates make the fewest direct payments.
 * @param {Array<{ debtor: string, creditor: string, amount: number }>} directDebts
 * @returns {Array<{ from: string, to: string, amount: number, reason: string }>}
 */
export function simplifyDebts(directDebts) {
  const netBalances = {};

  directDebts.forEach(({ debtor, creditor, amount }) => {
    netBalances[debtor] = (netBalances[debtor] || 0) - amount;
    netBalances[creditor] = (netBalances[creditor] || 0) + amount;
  });

  const debtors = [];
  const creditors = [];

  Object.entries(netBalances).forEach(([person, balance]) => {
    const rounded = Math.round(balance * 100) / 100;
    if (rounded < -0.01) {
      debtors.push({ person, balance: -rounded });
    } else if (rounded > 0.01) {
      creditors.push({ person, balance: rounded });
    }
  });

  // Sort descending
  debtors.sort((a, b) => b.balance - a.balance);
  creditors.sort((a, b) => b.balance - a.balance);

  const simplified = [];
  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];
    const settlementAmount = Math.min(debtor.balance, creditor.balance);

    if (settlementAmount > 0.01) {
      simplified.push({
        from: debtor.person,
        to: creditor.person,
        amount: Math.round(settlementAmount),
        reason: "AI simplified hostel debt path",
      });
    }

    debtor.balance -= settlementAmount;
    creditor.balance -= settlementAmount;

    if (debtor.balance < 0.01) d++;
    if (creditor.balance < 0.01) c++;
  }

  return simplified;
}
