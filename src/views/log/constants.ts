
const LOG_DAILY = '1'
const LOG_WEEK = '2'
const LOG_MONTH = '3'

export const LOG_LIST = [
  {
    key: LOG_DAILY,
    name: 'Daily',
    doneTitle: 'Finish work today',
    undoneTitle: 'Unfinished work today',
    planTitle: 'Tomorrow work plan',
    summaryTitle: 'Work summary'
  },
  {
    key: LOG_WEEK,
    name: 'Weekly',
    doneTitle: 'Finish work this week',
    undoneTitle: 'Unfinished work this week',
    planTitle: `Next week's work plan`,
    summaryTitle: 'Work summary'
  },
  {
    key: LOG_MONTH,
    name: 'Monthly',
    doneTitle: 'Work done this month',
    undoneTitle: 'Unfinished work this month',
    planTitle: 'Work plan for next month',
    summaryTitle: 'Work summary'
  }
]
