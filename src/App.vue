<script setup lang="ts">
import { computed, ref } from 'vue'
import HomePage from './pages/HomePage.vue'
import SubjectSelectPage from './pages/SubjectSelectPage.vue'
import ItemListPage from './pages/ItemListPage.vue'
import CompletePage from './pages/CompletePage.vue'
import ZukanPage from './pages/ZukanPage.vue'
import { commonItemIds, itemMap } from './data/items'
import { subjectMap } from './data/subjects'
import { useLocalStorage } from './composables/useLocalStorage'
import type { ItemProgress, Stats, SubjectProgress, TodayState } from './types'

type Page = 'home'|'subjects'|'items'|'complete'|'zukan'
const page = ref<Page>('home')
const latestItem = ref<string>()
const dateKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
const emptyToday = ():TodayState => ({ date:dateKey(), selectedSubjectIds:[], completedItemIds:[], awakenedItemMonsterIds:[], poweredSubjectMonsterIds:[], isCompleted:false, earnedStars:0 })
const user = useLocalStorage('mochimono-monster:user', { nickname:'', recentSubjectIds:[] as string[] })
const today = useLocalStorage<TodayState>('mochimono-monster:today', emptyToday())
const subjectProgress = useLocalStorage<SubjectProgress>('mochimono-monster:subject-progress', {})
const itemProgress = useLocalStorage<ItemProgress>('mochimono-monster:item-progress', {})
const stats = useLocalStorage<Stats>('mochimono-monster:stats', { totalStars:0, streak:0 })

if (today.value.date !== dateKey()) today.value = emptyToday()

const requiredItemIds = computed(() => {
  const ids = today.value.selectedSubjectIds.flatMap((id)=>subjectMap[id]?.itemIds || [])
  return [...new Set([...commonItemIds,...ids])]
})

function selectSubjects(ids:string[]) {
  if (today.value.isCompleted) {
    page.value = 'complete'
    return
  }
  today.value = { ...emptyToday(), selectedSubjectIds:ids }
  user.value.recentSubjectIds = ids
  page.value = 'items'
}

function previousDate(date:string) {
  const d = new Date(`${date}T12:00:00`); d.setDate(d.getDate()-1)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function completeItem(id:string) {
  if (today.value.completedItemIds.includes(id) || today.value.isCompleted) return
  const item = itemMap[id]
  today.value.completedItemIds.push(id)
  if (!today.value.awakenedItemMonsterIds.includes(item.monsterId)) {
    today.value.awakenedItemMonsterIds.push(item.monsterId)
  }
  latestItem.value = id
  window.setTimeout(()=> { if (latestItem.value===id) latestItem.value=undefined }, 3600)
  if (today.value.completedItemIds.length === requiredItemIds.value.length) window.setTimeout(finishDay, 3800)
}

function finishDay() {
  if (today.value.isCompleted) return
  const monsters = today.value.selectedSubjectIds.map((id)=>subjectMap[id].monsterId)
  today.value.poweredSubjectMonsterIds = monsters
  today.value.earnedStars = monsters.length
  today.value.isCompleted = true
  for (const monsterId of monsters) {
    const old = subjectProgress.value[monsterId] || { completedCount:0 }
    subjectProgress.value[monsterId] = { completedCount:old.completedCount+1, lastCompletedDate:dateKey() }
  }
  for (const id of today.value.completedItemIds) {
    const item = itemMap[id]
    const old = itemProgress.value[item.monsterId] || { foundCount:0 }
    if (old.lastFoundDate !== dateKey()) {
      itemProgress.value[item.monsterId] = { foundCount:old.foundCount+1, lastFoundDate:dateKey() }
    }
  }
  stats.value.streak = stats.value.lastCompletedDate === previousDate(dateKey()) ? stats.value.streak+1 : 1
  stats.value.lastCompletedDate = dateKey()
  stats.value.totalStars += monsters.length
  page.value = 'complete'
}

function openDailyFlow() {
  page.value = today.value.isCompleted ? 'complete' : 'subjects'
}
</script>
<template>
  <Transition name="page" mode="out-in">
    <HomePage v-if="page==='home'" :nickname="user.nickname" :today="today" :stats="stats" :subject-progress="subjectProgress" @save-name="(name)=>user.nickname=name" @start="openDailyFlow" @zukan="page='zukan'" />
    <SubjectSelectPage v-else-if="page==='subjects'" :initial="today.isCompleted ? user.recentSubjectIds : today.selectedSubjectIds" :subject-progress="subjectProgress" @back="page='home'" @confirm="selectSubjects" />
    <ItemListPage v-else-if="page==='items'" :item-ids="requiredItemIds" :completed="today.completedItemIds" :selected-subject-ids="today.selectedSubjectIds" :latest="latestItem" @back="page='subjects'" @complete="completeItem" />
    <CompletePage v-else-if="page==='complete'" :today="today" :stats="stats" :subject-progress="subjectProgress" @home="page='home'" />
    <ZukanPage v-else :subject-progress="subjectProgress" :item-progress="itemProgress" @back="page='home'" />
  </Transition>
</template>
