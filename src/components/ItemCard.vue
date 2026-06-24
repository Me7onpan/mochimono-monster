<script setup lang="ts">
import type { Item, Subject } from '../types'
import RubyText from './RubyText.vue'
import CreatureArt from './CreatureArt.vue'
import MonsterName from './MonsterName.vue'
import RarityBadge from './RarityBadge.vue'
import FoilLayer from './FoilLayer.vue'
import StarParticles from './StarParticles.vue'

withDefaults(defineProps<{
  item: Item
  done: boolean
  newFriend?: boolean
  targetSubjects?: Subject[]
}>(), { targetSubjects: () => [] })

defineEmits<{ complete: [] }>()
</script>

<template>
  <button class="item-card" :class="{ done, pop: newFriend }" @click="$emit('complete')" :disabled="done">
    <FoilLayer :class="{ active: newFriend }" />
    <StarParticles v-if="newFriend" :count="12" />
    <RarityBadge type="companion" />
    <CreatureArt kind="item" :creature="item.id" :active="done" />
    <span class="copy">
      <b><RubyText :text="item.label" :reading="item.ruby" /></b>
      <small><MonsterName :label="item.label" :reading="item.ruby" :name="item.monsterName" /></small>
    </span>
    <span class="status">{{ done ? 'できた！' : 'まだ' }}</span>

    <div v-if="newFriend" class="card-toast">
      <div class="toast-message"><span>なかまできた！</span><strong v-if="targetSubjects.length">かけら +1</strong></div>
      <div v-if="targetSubjects.length" class="toast-targets">
        <span v-for="subject in targetSubjects" :key="subject.id" :aria-label="subject.label">
          <CreatureArt kind="subject" :creature="subject.id" size="small" />
          <small><RubyText :text="subject.label" :reading="subject.ruby" /></small>
        </span>
      </div>
    </div>
  </button>
</template>

<style scoped>
.item-card{position:relative;display:grid;grid-template-columns:96px minmax(0,1fr) auto;align-items:center;gap:18px;width:100%;min-height:180px;padding:30px 20px 20px;border:3px solid #64748b;border-radius:var(--radius-card);background:linear-gradient(145deg,#111827,#172554 55%,#0f172a);color:var(--text-main);text-align:left;box-shadow:inset 0 0 0 2px #ffffff08,0 9px 18px #02061780;cursor:pointer;overflow:hidden;transition:.22s transform,.22s filter,.22s border-color,.22s box-shadow,.22s background}.item-card:active:not(:disabled){transform:scale(.98)}.item-card:not(.done)>.creature-art{filter:saturate(.55) brightness(.72)}.item-card.done{border-color:#4ade80;background:linear-gradient(145deg,#14532d,#0f766e 52%,#164e63);box-shadow:inset 0 0 28px #86efac38,0 0 24px #22c55e55,0 10px 20px #0206178a}.item-card>.rarity{position:absolute;z-index:2;left:13px;top:10px}.item-card>.creature-art{position:relative;z-index:2;width:92px}.copy{position:relative;z-index:2;display:flex;min-width:0;flex-direction:column}.copy b{color:#fff;font-size:clamp(1.38rem,3vw,1.7rem);line-height:1.15}.copy small{margin-top:10px;color:var(--text-soft);font-size:.72rem}.status{position:relative;z-index:2;min-width:58px;padding:9px 11px;border:2px solid #fb923c;border-radius:999px;background:#9a3412;color:#fff7ed;font-size:.76rem;font-weight:900;text-align:center;white-space:nowrap;box-shadow:0 0 13px #f9731645}.done .status{border-color:#bbf7d0;background:#16a34a;color:#fff;box-shadow:0 0 16px #4ade8075}.pop{animation:card-reveal 1s cubic-bezier(.2,.9,.25,1)}
.card-toast{position:absolute;z-index:6;inset:5px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:8px 12px;border:2px solid #fde68a;border-radius:18px;background:linear-gradient(110deg,#172554fa,#312e81fa,#0e7490fa);background-size:200% 100%;color:#fff;box-shadow:0 0 28px #facc1566;pointer-events:none;animation:toast-card .35s ease,toast-shine 1.7s ease-in-out infinite}.toast-message{display:flex;align-items:center;justify-content:center;gap:22px}.toast-message span{color:#7dd3fc;font-size:1rem;font-weight:900;white-space:nowrap}.toast-message strong{padding:4px 10px;border:1px solid #fde68a80;border-radius:999px;background:#713f12a6;color:#fde68a;font-size:.92rem;white-space:nowrap}.toast-targets{display:flex;width:min(100%,310px);min-height:88px;align-items:center;justify-content:center;flex-wrap:nowrap;gap:7px}.toast-targets>span{display:flex;width:64px;min-width:0;flex:0 1 64px;flex-direction:column;align-items:center;justify-content:center;gap:3px}.toast-targets :deep(.creature-art.subject.small){width:56px!important;border-width:2px;box-shadow:0 4px 9px #020617cc,0 0 12px #fde68a4d}.toast-targets small{display:block;max-width:64px;color:#fff;font-size:.56rem;font-weight:900;line-height:1.1;text-align:center;white-space:nowrap}
@keyframes card-reveal{0%{transform:perspective(700px) rotateY(0) scale(.94)}38%{transform:perspective(700px) rotateY(14deg) scale(1.045)}70%{transform:perspective(700px) rotateY(-3deg) scale(1.01)}100%{transform:none}}@keyframes toast-card{from{opacity:0;transform:scale(.92) translateY(8px)}}@keyframes toast-shine{50%{background-position:100% 0;box-shadow:0 0 38px #38bdf878}}
@media(max-width:500px){.item-card{grid-template-columns:86px minmax(0,1fr) auto;gap:14px;min-height:174px;padding:29px 14px 19px}.item-card>.creature-art{width:82px}.copy b{font-size:1.4rem}.copy small{font-size:.67rem}.status{min-width:54px;padding:8px 9px}.card-toast{gap:6px;padding-inline:8px}.toast-message{gap:12px}.toast-message span{font-size:.9rem}.toast-message strong{padding:3px 8px;font-size:.8rem}.toast-targets{width:min(100%,292px);gap:5px}.toast-targets>span{width:60px;flex-basis:60px}.toast-targets :deep(.creature-art.subject.small){width:54px!important}.toast-targets small{max-width:60px;font-size:.52rem}}
</style>
