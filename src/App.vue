<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import RubyText from './components/RubyText.vue'
import HomePage from './pages/HomePage.vue'
import SubjectSelectPage from './pages/SubjectSelectPage.vue'
import ItemListPage from './pages/ItemListPage.vue'
import CompletePage from './pages/CompletePage.vue'
import ZukanPage from './pages/ZukanPage.vue'
import { commonItemIds, itemMap, mondayItemIds } from './data/items'
import { subjectMap } from './data/subjects'
import { useLocalStorage } from './composables/useLocalStorage'
import { migrateRetiredItems } from './utils/retiredItems'
import type { ItemProgress, Stats, SubjectProgress, TodayState, WeeklyItemState } from './types'

type Page = 'home'|'subjects'|'items'|'complete'|'zukan'
const page = ref<Page>('home')
const latestItem = ref<string>()
const updateVersion = '2026-10-25-essaybook'
const dateKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
const formatDate = (date:Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
const addDays = (date:string, days:number) => {
  const d = new Date(`${date}T12:00:00`)
  d.setDate(d.getDate()+days)
  return formatDate(d)
}
const weeklyMondayTarget = () => {
  const d = new Date()
  const weekday = d.getDay()
  if (weekday === 0) return addDays(dateKey(), 1)
  if (weekday === 1) return dateKey()
  return undefined
}
const emptyToday = ():TodayState => ({ date:dateKey(), selectedSubjectIds:[], completedItemIds:[], awakenedItemMonsterIds:[], poweredSubjectMonsterIds:[], isCompleted:false, earnedStars:0 })
const user = useLocalStorage('mochimono-monster:user', { nickname:'', recentSubjectIds:[] as string[] })
const today = useLocalStorage<TodayState>('mochimono-monster:today', emptyToday())
const subjectProgress = useLocalStorage<SubjectProgress>('mochimono-monster:subject-progress', {})
const itemProgress = useLocalStorage<ItemProgress>('mochimono-monster:item-progress', {})
const stats = useLocalStorage<Stats>('mochimono-monster:stats', { totalStars:0, streak:0 })
const weeklyItems = useLocalStorage<WeeklyItemState>('mochimono-monster:weekly-items', {})
const seenUpdate = useLocalStorage('mochimono-monster:update-seen', '')
const updateOpen = ref(seenUpdate.value !== updateVersion)

if (today.value.date !== dateKey()) today.value = emptyToday()
const migrated = migrateRetiredItems({ today:today.value, itemProgress:itemProgress.value, weeklyItems:weeklyItems.value })
if (migrated.today !== today.value) today.value = migrated.today
if (migrated.itemProgress !== itemProgress.value) itemProgress.value = migrated.itemProgress
if (migrated.weeklyItems !== weeklyItems.value) weeklyItems.value = migrated.weeklyItems

watch(page, async () => {
  await nextTick()
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
})

const weeklyItemIds = computed(() => {
  const target = weeklyMondayTarget()
  if (!target) return []
  return mondayItemIds.filter((id) => weeklyItems.value[id] !== target)
})

const requiredItemIds = computed(() => {
  const ids = today.value.selectedSubjectIds.flatMap((id)=>subjectMap[id]?.itemIds || [])
  return [...new Set([...commonItemIds,...weeklyItemIds.value,...ids])].filter((id) => itemMap[id])
})
const requiredItemsDone = () => {
  const required = requiredItemIds.value
  return required.length > 0 && required.every((id) => today.value.completedItemIds.includes(id))
}

function selectSubjects(ids:string[]) {
  if (today.value.isCompleted) {
    page.value = 'complete'
    return
  }
  today.value = { ...emptyToday(), selectedSubjectIds:ids }
  user.value.recentSubjectIds = ids
  page.value = 'items'
}

function isWeekend(date:string) {
  const day = new Date(`${date}T12:00:00`).getDay()
  return day === 0 || day === 6
}

function isStreakContinuation(lastDate:string | undefined, currentDate:string) {
  if (!lastDate || lastDate >= currentDate) return false
  let cursor = addDays(lastDate, 1)
  while (cursor < currentDate) {
    if (!isWeekend(cursor)) return false
    cursor = addDays(cursor, 1)
  }
  return true
}

function completeItem(id:string) {
  if (today.value.completedItemIds.includes(id) || today.value.isCompleted) return
  const item = itemMap[id]
  if (!item) return
  today.value.completedItemIds.push(id)
  if (!today.value.awakenedItemMonsterIds.includes(item.monsterId)) {
    today.value.awakenedItemMonsterIds.push(item.monsterId)
  }
  latestItem.value = id
  window.setTimeout(()=> { if (latestItem.value===id) latestItem.value=undefined }, 3600)
  if (requiredItemsDone()) window.setTimeout(finishDay, 3800)
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
    if (!item) continue
    const old = itemProgress.value[item.monsterId] || { foundCount:0 }
    if (old.lastFoundDate !== dateKey()) {
      itemProgress.value[item.monsterId] = { foundCount:old.foundCount+1, lastFoundDate:dateKey() }
    }
  }
  const target = weeklyMondayTarget()
  if (target) {
    for (const id of mondayItemIds) {
      if (today.value.completedItemIds.includes(id)) weeklyItems.value[id] = target
    }
  }
  stats.value.streak = isStreakContinuation(stats.value.lastCompletedDate, dateKey()) ? stats.value.streak+1 : 1
  stats.value.lastCompletedDate = dateKey()
  stats.value.totalStars += monsters.length
  page.value = 'complete'
}

function openDailyFlow() {
  page.value = today.value.isCompleted ? 'complete' : 'subjects'
}

function closeUpdateNotice() {
  seenUpdate.value = updateVersion
  updateOpen.value = false
}

if (!today.value.isCompleted && today.value.selectedSubjectIds.length > 0 && requiredItemsDone()) finishDay()
</script>
<template>
  <Transition name="page" mode="out-in">
    <HomePage v-if="page==='home'" :nickname="user.nickname" :today="today" :stats="stats" :subject-progress="subjectProgress" @save-name="(name)=>user.nickname=name" @start="openDailyFlow" @zukan="page='zukan'" />
    <SubjectSelectPage v-else-if="page==='subjects'" :initial="today.isCompleted ? user.recentSubjectIds : today.selectedSubjectIds" :subject-progress="subjectProgress" @back="page='home'" @confirm="selectSubjects" />
    <ItemListPage v-else-if="page==='items'" :item-ids="requiredItemIds" :weekly-item-ids="weeklyItemIds" :completed="today.completedItemIds" :selected-subject-ids="today.selectedSubjectIds" :latest="latestItem" @back="page='subjects'" @complete="completeItem" />
    <CompletePage v-else-if="page==='complete'" :today="today" :stats="stats" :subject-progress="subjectProgress" @home="page='home'" />
    <ZukanPage v-else :subject-progress="subjectProgress" :item-progress="itemProgress" @back="page='home'" />
  </Transition>

  <div v-if="updateOpen" class="update-backdrop">
    <section class="update-card" role="dialog" aria-modal="true" aria-labelledby="update-title">
      <span class="update-badge">NEW</span>
      <h2 id="update-title">あたらしい なかまが きたよ！</h2>
      <ul>
        <li><RubyText text="作文帳" reading="さくぶんちょう" />れんじゃくが、<RubyText text="国語" reading="こくご" />の なかまに なったよ！</li>
        <li><RubyText text="国語" reading="こくご" />の ひには、あかい <RubyText text="作文帳" reading="さくぶんちょう" />を もっていこう。</li>
      </ul>
      <button type="button" @click="closeUpdateNotice">OK！みにいく</button>
    </section>
  </div>
</template>

<style scoped>
.update-backdrop{position:fixed;z-index:80;inset:0;display:grid;place-items:center;padding:22px;background:#020617db;backdrop-filter:blur(10px)}.update-card{position:relative;width:min(100%,430px);padding:28px 22px 22px;border:3px solid transparent;border-radius:30px;background:linear-gradient(155deg,#172554,#24144d 58%,#0f172a) padding-box,linear-gradient(135deg,#fef3c7,#38bdf8,#a855f7) border-box;color:#fff;text-align:center;box-shadow:0 24px 45px #020617b8,0 0 34px #38bdf84a;overflow:hidden}.update-card::before{content:'✦';position:absolute;left:18px;top:14px;color:#fde68a;font-size:1.3rem}.update-card::after{content:'✦';position:absolute;right:22px;top:46px;color:#7dd3fc;font-size:1rem}.update-badge{display:inline-grid;place-items:center;min-width:72px;min-height:32px;margin-bottom:8px;border-radius:999px;background:linear-gradient(90deg,#facc15,#f97316);color:#111827;font-size:.82rem;font-weight:900;box-shadow:0 0 18px #facc155f}.update-card h2{margin:5px 0 14px;font-size:1.45rem;text-shadow:0 0 15px #38bdf865}.update-card ul{display:grid;gap:9px;margin:0 0 20px;padding:0;list-style:none;text-align:left}.update-card li{padding:10px 12px;border:1px solid #ffffff1f;border-radius:17px;background:#ffffff10;color:#e0f2fe;font-size:.88rem;font-weight:900;line-height:1.55}.update-card li::before{content:'★ ';color:#fde68a}.update-card button{width:100%;min-height:62px;border:0;border-radius:999px;background:linear-gradient(90deg,#facc15,#f97316);color:#1f2937;font:900 1rem var(--font);box-shadow:0 10px 18px #0206177a,0 0 18px #facc154c;cursor:pointer}.update-card button:active{transform:translateY(2px)}
</style>
