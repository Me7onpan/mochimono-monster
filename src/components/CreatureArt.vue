<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  kind: 'subject' | 'item'
  creature: string
  size?: 'small' | 'medium' | 'large'
  active?: boolean
  rank?: string
}>(), { size: 'medium', active: false, rank: 'まだ ひみつ' })

const nativeEvolutionSubjects = new Set(['japanese','math','moral','music','library','life','english','pe','art','pool','special-schedule'])
const hasNativeEvolution = computed(() => props.kind === 'subject' && nativeEvolutionSubjects.has(props.creature))
const rankAsset = computed(() => {
  if (!hasNativeEvolution.value) return props.creature
  return {
    'なかよし': `${props.creature}-friend`,
    'スーパー': `${props.creature}-super`,
    'マスター': `${props.creature}-master`,
  }[props.rank] || props.creature
})
const artSrc = computed(() => `${import.meta.env.BASE_URL}art/${props.kind === 'subject' ? 'subjects' : 'items'}/${props.kind === 'subject' ? rankAsset.value : props.creature}.png`)
const rankClass = computed(() => {
  if (props.kind !== 'subject') return ''
  return {
    'なかよし': 'rank-friend',
    'スーパー': 'rank-super',
    'マスター': 'rank-master',
  }[props.rank] || 'rank-found'
})
</script>

<template>
  <div class="creature-art" :class="[kind, size, rankClass, { active }]">
    <img :src="artSrc" :alt="creature" draggable="false" />
    <span v-if="kind === 'subject' && !hasNativeEvolution" class="evo-aura" aria-hidden="true" />
    <span v-if="kind === 'subject' && !hasNativeEvolution && (rank === 'スーパー' || rank === 'マスター')" class="evo-wings" aria-hidden="true" />
    <span v-if="kind === 'subject' && !hasNativeEvolution && rank === 'マスター'" class="evo-crown" aria-hidden="true">✦</span>
  </div>
</template>

<style scoped>
.creature-art{position:relative;display:grid;place-items:center;flex:0 0 auto;width:82px;aspect-ratio:1;border-radius:24%;overflow:hidden;background:#fff7e5;box-shadow:0 5px 0 #593d2726;transition:transform .2s ease,filter .2s ease}.creature-art img{position:absolute;z-index:2;inset:0;display:block;width:100%;height:100%;object-fit:cover;user-select:none}.creature-art.small{width:56px;border-radius:20%}.creature-art.large{width:112px}.creature-art.subject{width:94px;aspect-ratio:1;border:3px solid #f8fafc;border-radius:26%;background:radial-gradient(circle at 50% 38%,#fff7e5,#fef3c7)}.creature-art.subject.small{width:58px}.creature-art.subject.large{width:170px}.creature-art.subject img{object-fit:cover;transform:scale(1.12)}.creature-art.item{width:74px;border:2px solid #fff}.creature-art.item.small{width:54px}.creature-art.item.large{width:104px}.creature-art.item img{object-fit:contain}.creature-art.active{animation:creature-pop .7s ease-in-out infinite alternate;filter:saturate(1.08)}.creature-art.subject::after{content:'';position:absolute;z-index:5;inset:3px;border-radius:22%;border:1px solid #ffffff75;pointer-events:none}.creature-art.subject.rank-found{border-color:#f8fafc!important}.creature-art.subject.rank-friend{border-color:#7dd3fc!important}.creature-art.subject.rank-friend::after{border-color:#bae6fd;box-shadow:inset 0 0 8px #38bdf842}.creature-art.subject.rank-super{border-color:#c4b5fd!important}.creature-art.subject.rank-super::after{border-color:#ddd6fe;box-shadow:inset 0 0 9px #a855f754}.creature-art.subject.rank-master{border-color:#fde68a!important}.creature-art.subject.rank-master::after{border-color:#fef3c7;box-shadow:inset 0 0 10px #facc1570}.evo-aura,.evo-wings,.evo-crown{pointer-events:none}.subject.rank-found .evo-aura{position:absolute;z-index:1;inset:8%;border-radius:50%;background:radial-gradient(circle,#facc1530,transparent 60%)}.subject.rank-friend{box-shadow:0 0 16px #38bdf855,0 5px 0 #593d2726}.subject.rank-friend .evo-aura{position:absolute;z-index:3;right:8%;top:8%;width:25%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#fde68a,#facc15 45%,#fff0 62%);filter:drop-shadow(0 0 8px #facc15)}.subject.rank-super{box-shadow:0 0 22px #a855f780,0 5px 0 #593d2726}.subject.rank-super .evo-aura,.subject.rank-master .evo-aura{position:absolute;z-index:1;inset:-10%;background:conic-gradient(from 20deg,#38bdf800,#38bdf870,#facc1580,#a855f780,#38bdf800);animation:evo-spin 8s linear infinite}.subject.rank-super .evo-wings,.subject.rank-master .evo-wings{position:absolute;z-index:1;inset:20% -14% auto;height:34%;background:linear-gradient(135deg,transparent 20%,#7dd3fcaa 22% 45%,transparent 47%),linear-gradient(225deg,transparent 20%,#c4b5faaa 22% 45%,transparent 47%);filter:drop-shadow(0 0 8px #38bdf8)}.subject.rank-master{box-shadow:0 0 25px #facc1590,0 0 18px #a855f780,0 5px 0 #593d2726}.subject.rank-master .evo-crown{position:absolute;z-index:4;left:50%;top:1%;display:grid;place-items:center;width:32%;aspect-ratio:1;transform:translateX(-50%);border:2px solid #fff7ad;border-radius:50%;background:linear-gradient(145deg,#facc15,#a855f7);color:white;font-size:.9rem;font-weight:900;box-shadow:0 0 12px #facc15}@keyframes creature-pop{to{transform:translateY(-5px) rotate(1.5deg)}}@keyframes evo-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.subject.rank-super .evo-aura,.subject.rank-master .evo-aura{animation:none}}
/* Subject monster art is now treated as a big transparent character illustration.
   The legendary-card frame owns the "card" border, so the image itself must not
   add a small white avatar box that can make the monster look clipped. */
.creature-art.subject{border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important}
.creature-art.subject::after{display:none!important}
.creature-art.subject img{object-fit:contain!important;transform:scale(1.18);filter:drop-shadow(0 12px 12px #020617a0) drop-shadow(0 0 14px #ffffff24)}
.creature-art.subject.small img{transform:scale(1.04)}
.creature-art.subject.large img{transform:scale(1.24)}
/* Full-bleed item art was drawn to the canvas edge, so hats and ears crossed
   the rounded avatar. Inset the picture so the animal stays inside the frame. */
.creature-art.item{overflow:hidden}
.creature-art.item img{inset:10%;width:auto;height:auto;object-fit:contain}
</style>
