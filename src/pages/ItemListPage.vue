<script setup lang="ts">
import { computed } from 'vue'
import CreatureArt from '../components/CreatureArt.vue'
import ItemCard from '../components/ItemCard.vue'
import MonsterName from '../components/MonsterName.vue'
import RubyText from '../components/RubyText.vue'
import { commonItemIds, itemMap } from '../data/items'
import { subjectMap } from '../data/subjects'

const props = defineProps<{ itemIds: string[]; completed: string[]; selectedSubjectIds: string[]; latest?: string }>()
const emit = defineEmits<{ back: []; complete: [id: string] }>()

const percent = computed(() => Math.round(props.completed.length / props.itemIds.length * 100))
const selectedSubjects = computed(() => props.selectedSubjectIds.map((id) => subjectMap[id]).filter(Boolean))
const commonIds = computed(() => props.itemIds.filter((id) => commonItemIds.includes(id)))
const lessonIds = computed(() => props.itemIds.filter((id) => !commonItemIds.includes(id)))
const targetSubjects = computed(() => {
  if (!props.latest) return []
  return selectedSubjects.value.filter((subject) => subject.itemIds.includes(props.latest!))
})
const subjectStates = computed(() => selectedSubjects.value.map((subject) => ({
  subject,
  total: subject.itemIds.length,
  done: subject.itemIds.filter((id) => props.completed.includes(id)).length,
})))
const sectionDone = (ids: string[]) => ids.filter((id) => props.completed.includes(id)).length
</script>

<template>
  <main class="page item-page">
    <header class="item-header">
      <button @click="emit('back')" aria-label="もどる">‹</button>
      <div><small><RubyText text="明日" reading="あした" />の</small><h1><RubyText text="持" reading="も" />ち<RubyText text="物" reading="もの" />カード</h1></div>
      <span>{{ completed.length }}/{{ itemIds.length }}</span>
    </header>

    <div class="subject-badges">
      <div v-for="state in subjectStates" :key="state.subject.id">
        <CreatureArt kind="subject" :creature="state.subject.id" size="small" />
        <span><MonsterName :label="state.subject.label" :reading="state.subject.ruby" :name="state.subject.monsterName" /><small v-if="state.total">{{ state.done }}/{{ state.total }}</small><small v-else class="ready">もうOK！</small></span>
      </div>
    </div>

    <div class="progress"><i :style="{ width: percent + '%' }" /><b>じゅんび {{ percent }}%</b></div>

    <section class="item-section">
      <header class="section-heading"><div><small>まいにちの</small><h2>いつもの もちもの</h2></div><b>{{ sectionDone(commonIds) }}/{{ commonIds.length }}</b></header>
      <div class="item-grid"><ItemCard v-for="id in commonIds" :key="id" :item="itemMap[id]" :done="completed.includes(id)" :new-friend="latest === id" :target-subjects="latest === id ? targetSubjects : []" @complete="emit('complete', id)" /></div>
    </section>

    <section class="item-section lesson-section">
      <header class="section-heading"><div><small>あしたの</small><h2>じゅぎょうの もちもの</h2></div><b>{{ sectionDone(lessonIds) }}/{{ lessonIds.length }}</b></header>
      <div v-if="lessonIds.length" class="item-grid"><ItemCard v-for="id in lessonIds" :key="id" :item="itemMap[id]" :done="completed.includes(id)" :new-friend="latest === id" :target-subjects="latest === id ? targetSubjects : []" @complete="emit('complete', id)" /></div>
      <div v-else class="nothing-special"><strong>とくべつな もちもの なし！</strong><span>もう OK！</span></div>
    </section>
  </main>
</template>

<style scoped>
.item-page{padding-bottom:50px}.item-header{display:grid;grid-template-columns:60px 1fr 62px;align-items:center;max-width:980px;margin:auto;padding:20px;text-align:center}.item-header button{width:56px;height:56px;border:1px solid #ffffff30;border-radius:50%;background:#ffffff10;color:white}.item-header small{color:#7dd3fc;font-weight:900}.item-header h1{margin:2px 0;font-size:1.55rem}.item-header>span{font-weight:900;color:#fde68a}.subject-badges{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;max-width:940px;margin:0 auto 16px;padding:0 16px}.subject-badges>div{display:flex;align-items:center;gap:7px;padding:5px 10px 5px 5px;border:1px solid #ffffff20;border-radius:999px;background:#ffffff0d;color:var(--text-soft);font-size:.65rem;font-weight:900}.subject-badges>div>span{display:flex;flex-direction:column;gap:2px}.subject-badges small{color:#93c5fd;font-size:.56rem}.subject-badges small.ready{color:#86efac}.subject-badges :deep(.creature-art){width:38px;box-shadow:none}.progress{position:relative;height:21px;max-width:650px;margin:0 auto 25px;border:2px solid #ffffff2b;border-radius:999px;background:#02061770;overflow:hidden}.progress i{display:block;height:100%;background:linear-gradient(90deg,#38bdf8,#22c55e,#facc15);box-shadow:0 0 12px #38bdf8;transition:.4s width}.progress b{position:absolute;inset:0;color:white;text-align:center;font-size:.65rem;line-height:17px}.item-section{max-width:1020px;margin:0 auto 30px}.section-heading{display:flex;align-items:flex-end;justify-content:space-between;margin:0 20px 13px;padding:0 4px}.section-heading small{color:#7dd3fc;font-size:.63rem;font-weight:900}.section-heading h2{margin:2px 0 0;color:#fff;font-size:1.15rem}.section-heading>b{padding:6px 11px;border-radius:999px;background:#ffffff10;color:#fde68a;font-size:.7rem}.lesson-section{padding-top:23px;border-top:1px solid #ffffff18}.item-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;padding:0 20px}.nothing-special{display:flex;min-height:120px;flex-direction:column;align-items:center;justify-content:center;gap:8px;margin:0 20px;border:2px dashed #86efac66;border-radius:24px;background:#14532d2b;color:#d1fae5;text-align:center}.nothing-special strong{font-size:1.05rem}.nothing-special span{padding:5px 12px;border-radius:999px;background:#16a34a;color:white;font-weight:900}@media(max-width:680px){.item-grid{grid-template-columns:1fr}.subject-badges{justify-content:flex-start;overflow-x:auto;flex-wrap:nowrap}.subject-badges>div{flex:0 0 auto}.section-heading{margin-inline:15px}.item-grid{padding-inline:15px}.nothing-special{margin-inline:15px}}
</style>
