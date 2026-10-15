import { itemMap } from '../data/items'
import type { ItemProgress, TodayState, WeeklyItemState } from '../types'

/** Catalog ids removed from the app. Old saves may still mention them. */
export const retiredItemIds = ['pianica'] as const

const retiredItemIdSet = new Set<string>(retiredItemIds)
const retiredMonsterIdSet = new Set(retiredItemIds.map((id) => `${id}-monster`))

export function migrateRetiredItems(input: {
  today: TodayState
  itemProgress: ItemProgress
  weeklyItems: WeeklyItemState
}) {
  const completedItemIds = input.today.completedItemIds.filter((id) => !retiredItemIdSet.has(id) && itemMap[id])
  const awakenedItemMonsterIds = input.today.awakenedItemMonsterIds.filter((id) => !retiredMonsterIdSet.has(id))
  const todayChanged = completedItemIds.length !== input.today.completedItemIds.length
    || awakenedItemMonsterIds.length !== input.today.awakenedItemMonsterIds.length

  let weeklyChanged = false
  const weeklyItems: WeeklyItemState = {}
  for (const [id, value] of Object.entries(input.weeklyItems)) {
    if (retiredItemIdSet.has(id)) {
      weeklyChanged = true
      continue
    }
    weeklyItems[id] = value
  }

  return {
    today: todayChanged ? { ...input.today, completedItemIds, awakenedItemMonsterIds } : input.today,
    itemProgress: input.itemProgress,
    weeklyItems: weeklyChanged ? weeklyItems : input.weeklyItems,
  }
}
