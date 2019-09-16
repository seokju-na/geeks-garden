import { isSameDay } from 'date-fns';
import { getCalendarMonthWeeks } from './calendar';

describe('utils.calendar', () => {
  function validateCalendar(
    monthWeeks: ReturnType<typeof getCalendarMonthWeeks>,
    table: Array<Array<string | number>>,
  ) {
    for (let i = 0; i < table.length; i += 1) {
      for (let j = 0; j < table[i].length; j += 1) {
        const cell = table[i][j];
        const day = monthWeeks[i][j];

        if (cell === 'x' && !day.isOutsideDay) {
          throw new Error();
        } else if (typeof cell === 'number') {
          const cellDay = new Date(day.day.toString());
          cellDay.setDate(cell);

          if (!isSameDay(day.day, cellDay)) {
            throw new Error(`${day.day} is not same day with ${cellDay}`);
          }
        }
      }
    }
  }

  it('July 2018', () => {
    /**
     * July 2018
     *
     * S  M  T  W  T  F  S
     * 1  2  3  4  5  6  7
     * 8  9  10 11 12 13 14
     * 15 16 17 18 19 20 21
     * 22 23 24 25 26 27 28
     * 29 30 31 x  x  x  x
     */

    const table = [
      [1, 2, 3, 4, 5, 6, 7],
      [8, 9, 10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19, 20, 21],
      [22, 23, 24, 25, 26, 27, 28],
      [29, 30, 31, 'x', 'x', 'x', 'x'],
    ];

    validateCalendar(getCalendarMonthWeeks(new Date(2018, 7 - 1)), table);
  });

  it('June 2018', () => {
    /**
     * June 2018
     *
     * S  M  T  W  T  F  S
     * x  x  x  x  x  1  2
     * 3  4  5  6  7  8  9
     * 10 11 12 13 14 15 16
     * 17 18 19 20 21 22 23
     * 24 25 26 27 28 29 30
     */

    const table = [
      ['x', 'x', 'x', 'x', 'x', 1, 2],
      [3, 4, 5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14, 15, 16],
      [17, 18, 19, 20, 21, 22, 23],
      [24, 25, 26, 27, 28, 29, 30],
    ];

    validateCalendar(getCalendarMonthWeeks(new Date(2018, 6 - 1)), table);
  });

  it('July 2019', () => {
    /**
     * July 2019
     *
     * S  M  T  W  T  F  S
     * x  1  2  3  4  5  6
     * 7  8  9  10 11 12 13
     * 14 15 16 17 18 19 20
     * 21 22 23 24 25 26 27
     * 28 29 30 31 x  x  x
     */

    const table = [
      ['x', 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, 'x', 'x', 'x'],
    ];

    validateCalendar(getCalendarMonthWeeks(new Date(2019, 7 - 1)), table);
  });

  it('Feb 2020', () => {
    /**
     * Feb 2020
     *
     * S  M  T  W  T  F  S
     * x  x  x  x  x  x  1
     * 2  3  4  5  6  7  8
     * 9  10 11 12 13 14 15
     * 16 17 18 19 20 21 22
     * 23 24 25 26 27 28 29
     */

    const table = [
      ['x', 'x', 'x', 'x', 'x', 'x', 1],
      [2, 3, 4, 5, 6, 7, 8],
      [9, 10, 11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20, 21, 22],
      [23, 24, 25, 26, 27, 28, 29],
    ];

    validateCalendar(getCalendarMonthWeeks(new Date(2020, 2 - 1)), table);
  });
});
