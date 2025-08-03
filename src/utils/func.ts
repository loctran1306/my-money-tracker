export const formatCurrency = (amount: number) => {
  // Get the sign
  const sign = amount < 0 ? '-' : '';

  // Convert to string with 3 decimal places (use absolute value for formatting)
  const formatted = Math.abs(amount).toFixed(3);
  const [integerPart, decimalPart] = formatted.split('.');

  // Add dots for thousands separator
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Combine with sign, decimal part using dot
  return `${sign}${formattedInteger}.${decimalPart} ₫`;
};

export const calculateExpression = (expression: string): number | null => {
  try {
    // Loại bỏ khoảng trắng
    const cleanExpression = expression.replace(/\s/g, '');

    if (!/^[\d+\-*/().]+$/.test(cleanExpression)) {
      return null;
    }

    const result = Function(`'use strict'; return (${cleanExpression})`)();

    if (typeof result !== 'number' || !isFinite(result)) {
      return null;
    }

    return result;
  } catch (error) {
    return null;
  }
};

export const calculateAndFormat = (expression: string): number | string => {
  const result = calculateExpression(expression);
  if (result !== null) {
    return result;
  }
  return expression;
};

// Date utilities to handle timezone properly
export const toLocalISOString = (date: Date) => {
  // Get timezone offset in minutes and convert to milliseconds
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  // Adjust date by timezone offset to get local time
  const localDate = new Date(date.getTime() - timezoneOffset);
  // Return ISO string of local time
  return localDate.toISOString();
};

export const formatLocalDate = (dateString: string) => {
  // Parse UTC date string and display in local timezone
  return new Date(dateString);
};
