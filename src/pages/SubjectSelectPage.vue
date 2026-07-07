<script setup lang="ts">
import { ref } from 'vue'
import CapsuleButton from '../components/CapsuleButton.vue'
import LegendarySubjectCard from '../components/LegendarySubjectCard.vue'
import RubyText from '../components/RubyText.vue'
import { subjects } from '../data/subjects'
import type { SubjectProgress } from '../types'
const props=defineProps<{initial:string[];subjectProgress:SubjectProgress}>()
const emit=defineEmits<{back:[];confirm:[ids:string[]]}>();const selected=ref([...props.initial])
function toggle(id:string){selected.value=selected.value.includes(id)?selected.value.filter(x=>x!==id):[...selected.value,id]}
</script>
<template><main class="page subject-page"><header class="page-header"><button @click="emit('back')" aria-label="もどる">‹</button><div><small><RubyText text="伝説" reading="でんせつ" />カードを えらぼう</small><h1><RubyText text="明日" reading="あした"/>の <RubyText text="授業" reading="じゅぎょう" /></h1></div><span>{{ selected.length }}</span></header><section class="card-grid"><LegendarySubjectCard v-for="subject in subjects" :key="subject.id" :subject="subject" :selected="selected.includes(subject.id)" :count="subjectProgress[subject.monsterId]?.completedCount||0" @toggle="toggle(subject.id)"/></section><div class="sticky-action"><CapsuleButton :disabled="!selected.length" @click="emit('confirm',selected)"><RubyText text="持" reading="も" />ち<RubyText text="物" reading="もの" />カードを <RubyText text="見" reading="み" />る！ →</CapsuleButton></div></main></template>
<style scoped>
.subject-page{padding-bottom:112px}.page-header{display:grid;grid-template-columns:60px 1fr 60px;align-items:center;max-width:1050px;margin:auto;padding:20px;text-align:center}.page-header button{width:56px;height:56px;border:1px solid #ffffff30;border-radius:50%;background:#ffffff10;color:white;font:900 2rem/1 var(--font);box-shadow:0 6px 12px #02061766}.page-header small{color:#7dd3fc;font-weight:900}.page-header h1{margin:3px 0;font-size:1.55rem}.page-header>span{display:grid;place-items:center;width:52px;height:52px;border:2px solid #fde68a;border-radius:50%;background:#7c3aed;color:#fff;font-weight:900;box-shadow:0 0 15px #a855f7}.card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;max-width:1050px;margin:auto;padding:8px 20px 30px}.sticky-action{position:fixed;z-index:10;left:0;right:0;bottom:0;padding:18px max(20px,calc((100% - 590px)/2)) max(18px,env(safe-area-inset-bottom));background:linear-gradient(transparent,#0f172aed 28%)}@media(max-width:900px){.card-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.card-grid{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:8px 36px 35px}.card-grid :deep(.legend-card){min-width:285px;scroll-snap-align:center}.card-grid::-webkit-scrollbar{display:none}}
</style>
