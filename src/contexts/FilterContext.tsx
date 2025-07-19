'use client';

import { MONTHS } from '@/constants';
import { createContext, useEffect, useState } from 'react';

type FilterContextType = {
  dateRange: {
    startDate: string | Date | null;
    endDate: string | Date | null;
  };
  setDateRange: (dateRange: {
    startDate: string | Date | null;
    endDate: string | Date | null;
  }) => void;
  openTransactionForm: boolean;
  setOpenTransactionForm: (openTransactionForm: boolean) => void;
  monthSelected: string;
  setMonthSelected: (monthSelected: string) => void;
  timeRefresh: number;
  setTimeRefresh: (timeRefresh: number) => void;
};
function getMonthDateRange(
  monthIndex: number,
  year = new Date().getFullYear()
) {
  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + 1, 0);
  endDate.setHours(23, 59, 59, 999);
  return {
    startDate: startDate,
    endDate: endDate,
  };
}

export const FilterContext = createContext<FilterContextType>({
  dateRange: getMonthDateRange(MONTHS[new Date().getMonth()].index),
  monthSelected: MONTHS[new Date().getMonth()].value,
  setMonthSelected: () => {},
  setDateRange: () => {},
  openTransactionForm: false,
  setOpenTransactionForm: () => {},
  timeRefresh: 0,
  setTimeRefresh: () => {},
});

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [monthSelected, setMonthSelected] = useState(() => {
    const currentMonth = new Date().getMonth();
    return MONTHS[currentMonth].value;
  });
  const [dateRange, setDateRange] = useState<{
    startDate: string | Date | null;
    endDate: string | Date | null;
  }>(() => {
    const { startDate, endDate } = getMonthDateRange(
      MONTHS.find((m) => m.value === monthSelected)?.index || 0
    );
    return {
      startDate,
      endDate,
    };
  });
  const [openTransactionForm, setOpenTransactionForm] = useState(false);
  const [timeRefresh, setTimeRefresh] = useState(0);
  useEffect(() => {
    if (monthSelected === 'All') {
      const currentYear = new Date().getFullYear();
      setDateRange({
        startDate: new Date(currentYear, 0, 1), // 1/1 của năm hiện tại
        endDate: new Date(currentYear, 11, 31, 23, 59, 59, 999), // 31/12 của năm hiện tại
      });
      return;
    } else {
      setDateRange(
        getMonthDateRange(
          MONTHS.find((m) => m.value === monthSelected)?.index || 0
        )
      );
    }
  }, [monthSelected]);

  return (
    <FilterContext.Provider
      value={{
        dateRange,
        setDateRange,
        openTransactionForm,
        setOpenTransactionForm,
        monthSelected,
        setMonthSelected,
        timeRefresh,
        setTimeRefresh,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
