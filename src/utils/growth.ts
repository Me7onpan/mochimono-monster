export type GrowthRank = 'まだ ひみつ' | 'みつけた' | 'なかよし' | 'スーパー' | 'マスター'

const milestones = [
  { count: 1, rank: 'みつけた' as GrowthRank },
  { count: 7, rank: 'なかよし' as GrowthRank },
  { count: 20, rank: 'スーパー' as GrowthRank },
  { count: 50, rank: 'マスター' as GrowthRank },
]

export function growthInfo(count: number) {
  const current = [...milestones].reverse().find((step) => count >= step.count)
  const next = milestones.find((step) => count < step.count)
  return {
    rank: current?.rank ?? 'まだ ひみつ',
    nextRank: next?.rank,
    nextCount: next?.count,
    remaining: next ? next.count - count : 0,
    progress: next ? Math.min(100, Math.round((count / next.count) * 100)) : 100,
  }
}
