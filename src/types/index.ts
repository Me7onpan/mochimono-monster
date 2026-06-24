export type Subject = {
  id: string
  label: string
  ruby: string
  icon: string
  monsterId: string
  monsterName: string
  itemIds: string[]
  message: string
  color: string
}

export type Item = {
  id: string
  label: string
  ruby: string
  icon: string
  monsterId: string
  monsterName: string
  motif: string
}

export type TodayState = {
  date: string
  selectedSubjectIds: string[]
  completedItemIds: string[]
  awakenedItemMonsterIds: string[]
  poweredSubjectMonsterIds: string[]
  isCompleted: boolean
  earnedStars: number
}

export type SubjectProgress = Record<string, { completedCount: number; lastCompletedDate?: string }>
export type ItemProgress = Record<string, { foundCount: number; lastFoundDate?: string }>
export type Stats = { totalStars: number; streak: number; lastCompletedDate?: string }
