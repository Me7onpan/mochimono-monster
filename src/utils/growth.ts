export type GrowthRank = 'まだ ひみつ' | 'みつけた' | 'なかよし' | 'スーパー' | 'マスター' | 'メガ' | 'スペシャル'

export const growthMilestones = [
  { count: 1, rank: 'みつけた' as GrowthRank },
  { count: 7, rank: 'なかよし' as GrowthRank },
  { count: 20, rank: 'スーパー' as GrowthRank },
  { count: 50, rank: 'マスター' as GrowthRank },
  { count: 100, rank: 'メガ' as GrowthRank },
  { count: 150, rank: 'スペシャル' as GrowthRank },
]

const rankFrameClass: Record<GrowthRank, string> = {
  'まだ ひみつ': 'rank-found',
  'みつけた': 'rank-found',
  'なかよし': 'rank-friend',
  'スーパー': 'rank-super',
  'マスター': 'rank-master',
  'メガ': 'rank-mega',
  'スペシャル': 'rank-special',
}

export function growthRankClass(rank: string) {
  return rankFrameClass[rank as GrowthRank] ?? 'rank-found'
}

export function growthLevel(rank: string) {
  const index = growthMilestones.findIndex((step) => step.rank === rank)
  return index >= 0 ? index + 1 : 0
}

export function rankStarCount(rank: string) {
  if (rank === 'スーパー' || rank === 'マスター') return 2
  if (rank === 'スペシャル') return 3
  return 0
}

export function growthInfo(count: number) {
  const current = [...growthMilestones].reverse().find((step) => count >= step.count)
  const next = growthMilestones.find((step) => count < step.count)
  return {
    rank: current?.rank ?? ('まだ ひみつ' as GrowthRank),
    nextRank: next?.rank,
    nextCount: next?.count,
    remaining: next ? next.count - count : 0,
    progress: next ? Math.min(100, Math.round((count / next.count) * 100)) : 100,
  }
}
