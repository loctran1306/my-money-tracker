export const formatCurrency = (amount: number) => {
  // Convert to string with 3 decimal places
  const formatted = Math.abs(amount).toFixed(3);
  const [integerPart, decimalPart] = formatted.split('.');

  // Add dots for thousands separator
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Combine with decimal part using dot
  return `${formattedInteger}.${decimalPart} ₫`;
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
