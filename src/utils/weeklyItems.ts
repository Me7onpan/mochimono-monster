import type { WeeklyItemState } from '../types'

export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function addDays(date: string, days: number) {
  const next = new Date(`${date}T12:00:00`)
  next.setDate(next.getDate() + days)
  return dateKey(next)
}

/** Sunday prep stores the coming Monday. Monday stores itself. Other days have no bring-to-school target. */
export function weeklyMondayTarget(today = dateKey()) {
  const weekday = new Date(`${today}T12:00:00`).getDay()
  if (weekday === 0) return addDays(today, 1)
  if (weekday === 1) return today
  return undefined
}

/** Friday is the only bring-home day. */
export function weeklyFridayTarget(today = dateKey()) {
  const weekday = new Date(`${today}T12:00:00`).getDay()
  return weekday === 5 ? today : undefined
}

export function dueWeeklyItemIds(
  today: string,
  weeklyItems: WeeklyItemState,
  mondayItemIds: readonly string[],
  fridayReturnItemIds: readonly string[],
) {
  const monday = weeklyMondayTarget(today)
  if (monday) return mondayItemIds.filter((id) => weeklyItems[id] !== monday)
  const friday = weeklyFridayTarget(today)
  if (friday) return fridayReturnItemIds.filter((id) => weeklyItems[id] !== friday)
  return []
}

export function weeklySectionKind(today = dateKey()): 'monday' | 'friday' {
  return weeklyFridayTarget(today) ? 'friday' : 'monday'
}
