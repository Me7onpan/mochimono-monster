<script setup lang="ts">
import { ref } from 'vue'
import CreatureArt from '../components/CreatureArt.vue'
import FoilLayer from '../components/FoilLayer.vue'
import MonsterName from '../components/MonsterName.vue'
import RarityBadge from '../components/RarityBadge.vue'
import RubyText from '../components/RubyText.vue'
import ZukanBinder from '../components/ZukanBinder.vue'
import { subjects } from '../data/subjects'
import { items } from '../data/items'
import { growthInfo } from '../utils/growth'
import type { ItemProgress, SubjectProgress } from '../types'

defineProps<{ subjectProgress: SubjectProgress; itemProgress: ItemProgress }>()
defineEmits<{ back: [] }>()
const tab = ref<'subject' | 'item'>('subject')
const formatDate = (date?: string) => date ? `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}` : ''
</script>

<template>
  <main class="page zukan-page">
    <header>
      <button @click="$emit('back')" aria-label="もどる">‹</button>
      <div><h1>モンスターずかん</h1></div>
    </header>

    <nav>
      <button :class="{ active: tab === 'subject' }" @click="tab = 'subject'"><RubyText text="授業" reading="じゅぎょう" />カード</button>
      <button :class="{ active: tab === 'item' }" @click="tab = 'item'"><RubyText text="持" reading="も" />ち<RubyText text="物" reading="もの" />カード</button>
    </nav>

    <ZukanBinder>
      <div v-if="tab === 'subject'" class="subject-album">
        <article
          v-for="subject in subjects"
          :key="subject.id"
          class="album-card legendary"
          :class="{ locked: !(subjectProgress[subject.monsterId]?.completedCount) }"
          :style="{ '--accent': subject.color }"
        >
          <FoilLayer />
          <div class="card-heading">
            <strong><RubyText :text="subject.label" :reading="subject.ruby" /></strong>
            <RarityBadge />
          </div>
          <div class="album-art"><CreatureArt v-if="subjectProgress[subject.monsterId]?.completedCount" kind="subject" :creature="subject.id" /><span v-else class="mystery-art">?</span></div>
          <div class="album-copy">
            <h2 v-if="subjectProgress[subject.monsterId]?.completedCount"><MonsterName :label="subject.label" :reading="subject.ruby" :name="subject.monsterName" /></h2>
            <h2 v-else class="undiscovered">まだ みつけていない</h2>
            <div class="kizuna-line"><span>★ きずな <b>{{ subjectProgress[subject.monsterId]?.completedCount || 0 }}</b></span><em>{{ growthInfo(subjectProgress[subject.monsterId]?.completedCount || 0).rank }}</em></div>
            <div class="growth-bar"><i :style="{ width: growthInfo(subjectProgress[subject.monsterId]?.completedCount || 0).progress + '%' }" /></div>
            <p v-if="growthInfo(subjectProgress[subject.monsterId]?.completedCount || 0).nextRank">{{ growthInfo(subjectProgress[subject.monsterId]?.completedCount || 0).nextRank }}まで あと{{ growthInfo(subjectProgress[subject.monsterId]?.completedCount || 0).remaining }}</p>
            <p v-else>さいこうの なかま！</p>
          </div>
        </article>
      </div>

      <div v-else class="item-album">
        <article v-for="item in items" :key="item.id" class="album-card companion" :class="{ locked: !(itemProgress[item.monsterId]?.foundCount) }">
          <FoilLayer />
          <div class="card-heading">
            <strong><RubyText :text="item.label" :reading="item.ruby" /></strong>
            <RarityBadge type="companion" />
          </div>
          <div class="album-art item-art"><CreatureArt v-if="itemProgress[item.monsterId]?.foundCount" kind="item" :creature="item.id" /><span v-else class="mystery-art">?</span></div>
          <div class="album-copy">
            <h2 v-if="itemProgress[item.monsterId]?.foundCount"><MonsterName :label="item.label" :reading="item.ruby" :name="item.monsterName" /></h2>
            <h2 v-else class="undiscovered">まだ みつけていない</h2>
            <p>{{ itemProgress[item.monsterId]?.foundCount || 0 }}かい みつけた</p>
            <em v-if="itemProgress[item.monsterId]?.lastFoundDate">さいきん {{ formatDate(itemProgress[item.monsterId].lastFoundDate) }}</em>
          </div>
        </article>
      </div>
    </ZukanBinder>
  </main>
</template>

<style scoped>
.zukan-page{padding:18px 18px 50px}header{display:grid;grid-template-columns:64px 1fr 64px;align-items:center;max-width:980px;margin:auto;text-align:center}header button{width:56px;height:56px;border:1px solid #ffffff30;border-radius:50%;background:#ffffff10;color:white;font:900 2rem/1 var(--font)}header small{color:#7dd3fc;font-weight:900}header h1{margin:2px 0;font-size:1.55rem}header>span{display:flex;height:54px;flex-direction:column;align-items:center;justify-content:center;border:1px solid #fde68a;border-radius:17px;background:#f59e0b;color:white;font-weight:900}header>span small{color:#fff;font-size:.48rem}nav{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:600px;margin:20px auto 0;padding:5px;border:1px solid #ffffff1f;border-radius:999px;background:#02061765}nav button{min-height:56px;border:0;border-radius:999px;background:transparent;color:#94a3b8;font:900 .83rem var(--font);cursor:pointer}nav button.active{background:linear-gradient(100deg,#0284c7,#7c3aed);color:white;box-shadow:0 0 16px #38bdf845}.subject-album,.item-album{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}.item-album{grid-template-columns:repeat(4,minmax(0,1fr))}.album-card{--accent:#a855f7;position:relative;display:flex;min-height:300px;flex-direction:column;align-items:center;padding:13px;border:2px solid color-mix(in srgb,var(--accent) 45%,#ffffff40);border-radius:22px;background:linear-gradient(145deg,#ffffff14,#1e1b4b99 55%,#0f172a);box-shadow:inset 0 0 0 2px #ffffff08,0 8px 14px #02061770;text-align:center;overflow:hidden}.card-heading{position:relative;z-index:3;display:flex;width:100%;min-height:48px;align-items:center;justify-content:space-between;gap:8px}.card-heading>strong{color:#fff;font-size:clamp(1.38rem,2.8vw,1.75rem);line-height:1.05;text-align:left;text-shadow:0 0 12px color-mix(in srgb,var(--accent) 65%,transparent)}.album-art{position:relative;z-index:2;display:grid;min-height:132px;place-items:center}.album-art :deep(.creature-art.subject){width:102px}.album-art :deep(.creature-art.item){width:102px}.item-art{width:100%}.item-clue{position:absolute;right:2px;bottom:8px;display:grid;place-items:center;width:44px;height:44px;border:2px solid #ffffff70;border-radius:14px;background:#f8fafce8;color:#172554;font-size:1.35rem;box-shadow:0 5px 12px #02061780}.album-copy{position:relative;z-index:2;width:100%;margin-top:auto}.album-copy h2{min-height:2.3em;margin:4px 0;color:#e0f2fe;font-size:.78rem;overflow-wrap:anywhere}.album-copy .undiscovered{display:grid;place-items:center;color:#94a3b8;font-size:.7rem}.kizuna-line{display:flex;align-items:center;justify-content:center;gap:7px;font-size:.68rem;font-weight:900}.kizuna-line span{color:#fde68a}.kizuna-line b{font-size:.9rem}.kizuna-line em{padding:3px 7px;border-radius:999px;background:#ffffff12;color:#fff;font-size:.62rem;font-style:normal}.growth-bar{height:9px;margin:7px 3px 5px;border-radius:999px;background:#020617b8;overflow:hidden}.growth-bar i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#38bdf8,#a855f7,#facc15);box-shadow:0 0 8px #38bdf8}.album-copy p{margin:5px 0;color:#cbd5e1;font-size:.65rem;font-weight:900}.album-copy>em{color:#94a3b8;font-size:.58rem;font-style:normal}.companion{min-height:250px;border-color:#38bdf850}.companion .card-heading>strong{font-size:clamp(1.2rem,2.3vw,1.52rem)}.locked{filter:saturate(.35)}.locked .album-art :deep(img){filter:brightness(.28)}.locked .album-art{opacity:.72}@media(max-width:850px){.subject-album{grid-template-columns:repeat(2,1fr)}.item-album{grid-template-columns:repeat(3,1fr)}}@media(max-width:560px){.zukan-page{padding-inline:10px}.subject-album,.item-album{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.album-card{min-height:280px;padding:10px}.companion{min-height:240px}.card-heading{min-height:54px;align-items:flex-start;flex-direction:column;gap:3px}.card-heading>strong,.companion .card-heading>strong{font-size:1.28rem}.album-art{min-height:120px}.album-art :deep(.creature-art.subject),.album-art :deep(.creature-art.item){width:92px}.item-clue{width:38px;height:38px;font-size:1.1rem}.album-copy h2{font-size:.7rem}}
header::after{content:'';display:block;width:56px;height:56px}.mystery-art{display:grid;place-items:center;width:92px;aspect-ratio:1;border:2px solid #ffffff2c;border-radius:24%;background:radial-gradient(circle,#4338ca75,#0f172ad9);color:#c4b5fd;font-size:3.4rem;font-weight:900;box-shadow:inset 0 0 20px #a855f735,0 0 14px #38bdf824}.legendary .mystery-art{aspect-ratio:3/4;border-radius:22%}.card-heading>.rarity.companion{min-height:0;height:auto;flex:0 0 auto;align-self:center}
</style>
