import {
  addDays, differenceInCalendarMonths,
  differenceInDays,
  format,
  isSameMonth,
  lastDayOfMonth,
  startOfMonth,
  subDays,
} from 'date-fns';

export function normalizeCalendarDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
}

export function cloneDate(date: Date) {
  return new Date(date.getTime());
}

export function isNextMonth(month: Date) {
  const currentMonth = new Date();
  return differenceInCalendarMonths(month, currentMonth) > 0;
}

export function isPreviousMonth(month: Date) {
  const currentMonth = new Date();
  return differenceInCalendarMonths(currentMonth, month) > 0;
}

export interface WeekDay {
  day: Date;
  isOutsideDay: boolean;
}

function getMonthKey(month: Date) {
  return format(month, 'yyyy-MM');
}

const memoizedMonthWeeks = new Map<string, WeekDay[][]>();

export function getCalendarMonthWeeks(month: Date): WeekDay[][] {
  const memoKey = getMonthKey(month);

  if (memoizedMonthWeeks.has(memoKey)) {
    return memoizedMonthWeeks.get(memoKey)!;
  }

  // set utc offset to get correct dates in future (when timezone changes)
  const firstDateOfMonth = normalizeCalendarDay(startOfMonth(month));
  const lastDateOfMonth = normalizeCalendarDay(lastDayOfMonth(month));

  const prevDays = firstDateOfMonth.getDay();
  const nextDays = 7 - lastDateOfMonth.getDay();
  const firstDay = subDays(firstDateOfMonth, prevDays);
  const lastDay = addDays(lastDateOfMonth, nextDays);

  const totalDays = differenceInDays(lastDay, firstDay);

  const weeks: WeekDay[][] = [];
  let currentDay = firstDay;

  for (let i = 0; i < totalDays; i += 1) {
    if (i % 7 === 0) {
      weeks.push([]);
    }

    weeks[weeks.length - 1].push({
      day: cloneDate(currentDay),
      isOutsideDay: !isSameMonth(month, currentDay),
    });

    currentDay = addDays(currentDay, 1);
  }

  memoizedMonthWeeks.set(memoKey, weeks);
  return weeks;
}
