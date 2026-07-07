<script setup lang="ts">
import { computed, ref } from 'vue'
import CreatureArt from '../components/CreatureArt.vue'
import FoilLayer from '../components/FoilLayer.vue'
import MonsterName from '../components/MonsterName.vue'
import RarityBadge from '../components/RarityBadge.vue'
import RubyText from '../components/RubyText.vue'
import ZukanBinder from '../components/ZukanBinder.vue'
import { subjects } from '../data/subjects'
import { items } from '../data/items'
import { growthInfo, growthMilestones } from '../utils/growth'
import type { ItemProgress, Subject, SubjectProgress } from '../types'

const props = defineProps<{ subjectProgress: SubjectProgress; itemProgress: ItemProgress }>()
defineEmits<{ back: [] }>()
const tab = ref<'subject' | 'item'>('subject')
const selectedSubject = ref<Subject>()
const formatDate = (date?: string) => date ? `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}` : ''
const subjectCount = (subject: Subject) => props.subjectProgress[subject.monsterId]?.completedCount || 0
const selectedCount = computed(() => selectedSubject.value ? subjectCount(selectedSubject.value) : 0)
const selectedGrowth = computed(() => growthInfo(selectedCount.value))
const evolutionStages = growthMilestones.map((stage) => ({
  ...stage,
  label: `★ きずな ${stage.count}`,
}))
const stageClass = (rank: string) => ({
  'みつけた': 'rank-found',
  'なかよし': 'rank-friend',
  'スーパー': 'rank-super',
  'マスター': 'rank-master',
}[rank] || 'rank-found')
const subjectRankClass = (subject: Subject) => stageClass(growthInfo(subjectCount(subject)).rank)
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
        <button
          v-for="subject in subjects"
          :key="subject.id"
          class="album-card legendary"
          :class="[subjectRankClass(subject), { locked: !(subjectProgress[subject.monsterId]?.completedCount) }]"
          :style="{ '--accent': subject.color }"
          type="button"
          @click="selectedSubject = subject"
        >
          <FoilLayer />
          <div class="card-heading">
            <strong><RubyText :text="subject.label" :reading="subject.ruby" /></strong>
            <RarityBadge />
          </div>
          <div class="album-art"><CreatureArt v-if="subjectProgress[subject.monsterId]?.completedCount" kind="subject" :creature="subject.id" :rank="growthInfo(subjectProgress[subject.monsterId]?.completedCount || 0).rank" /><span v-else class="mystery-art">?</span></div>
          <div class="album-copy">
            <h2 v-if="subjectProgress[subject.monsterId]?.completedCount"><MonsterName :label="subject.label" :reading="subject.ruby" :name="subject.monsterName" /></h2>
            <h2 v-else class="undiscovered">まだ <RubyText text="見" reading="み" />つけていない</h2>
            <div class="kizuna-line"><span>★ きずな <b>{{ subjectProgress[subject.monsterId]?.completedCount || 0 }}</b></span><em>{{ growthInfo(subjectProgress[subject.monsterId]?.completedCount || 0).rank }}</em></div>
            <div class="growth-bar"><i :style="{ width: growthInfo(subjectProgress[subject.monsterId]?.completedCount || 0).progress + '%' }" /></div>
            <p v-if="growthInfo(subjectProgress[subject.monsterId]?.completedCount || 0).nextRank">{{ growthInfo(subjectProgress[subject.monsterId]?.completedCount || 0).nextRank }}まで あと{{ growthInfo(subjectProgress[subject.monsterId]?.completedCount || 0).remaining }}</p>
            <p v-else>さいこうの なかま！</p>
          </div>
          <span class="tap-hint"><ruby>進化<rt>しんか</rt></ruby>を <RubyText text="見" reading="み" />る</span>
        </button>
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
            <h2 v-else class="undiscovered">まだ <RubyText text="見" reading="み" />つけていない</h2>
            <p>{{ itemProgress[item.monsterId]?.foundCount || 0 }}かい <RubyText text="見" reading="み" />つけた</p>
            <em v-if="itemProgress[item.monsterId]?.lastFoundDate"><RubyText text="最近" reading="さいきん" /> {{ formatDate(itemProgress[item.monsterId].lastFoundDate) }}</em>
          </div>
        </article>
      </div>
    </ZukanBinder>

    <div v-if="selectedSubject" class="modal-backdrop" @click.self="selectedSubject = undefined">
      <section class="evolution-modal" :style="{ '--accent': selectedSubject.color }" aria-modal="true" role="dialog">
        <button class="close-modal" type="button" aria-label="とじる" @click="selectedSubject = undefined">×</button>
        <div class="modal-title">
          <strong><RubyText :text="selectedSubject.label" :reading="selectedSubject.ruby" /></strong>
          <RarityBadge />
        </div>
        <h2><MonsterName :label="selectedSubject.label" :reading="selectedSubject.ruby" :name="selectedSubject.monsterName" /></h2>
        <div class="modal-kizuna">
          <span>★ きずな <b>{{ selectedCount }}</b></span>
          <em>{{ selectedGrowth.rank }}</em>
        </div>
        <div class="evolution-grid">
          <article v-for="stage in evolutionStages" :key="stage.rank" class="evolution-card" :class="[stageClass(stage.rank), { locked: selectedCount < stage.count }]">
            <div class="evolution-art">
              <CreatureArt v-if="selectedCount >= stage.count" kind="subject" :creature="selectedSubject.id" :rank="stage.rank" />
              <span v-else class="mystery-art">?</span>
            </div>
            <strong>{{ stage.rank }}</strong>
            <small>{{ stage.label }}</small>
          </article>
        </div>
        <p v-if="selectedGrowth.nextRank" class="next-note">{{ selectedGrowth.nextRank }}まで あと{{ selectedGrowth.remaining }}</p>
        <p v-else class="next-note"><RubyText text="全部" reading="ぜんぶ" /> <RubyText text="見" reading="み" />つけた！</p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.zukan-page{padding:18px 18px 50px}header{display:grid;grid-template-columns:64px 1fr 64px;align-items:center;max-width:980px;margin:auto;text-align:center}header button{width:56px;height:56px;border:1px solid #ffffff30;border-radius:50%;background:#ffffff10;color:white;font:900 2rem/1 var(--font)}header small{color:#7dd3fc;font-weight:900}header h1{margin:2px 0;font-size:1.55rem}header>span{display:flex;height:54px;flex-direction:column;align-items:center;justify-content:center;border:1px solid #fde68a;border-radius:17px;background:#f59e0b;color:white;font-weight:900}header>span small{color:#fff;font-size:.48rem}nav{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:600px;margin:20px auto 0;padding:5px;border:1px solid #ffffff1f;border-radius:999px;background:#02061765}nav button{min-height:56px;border:0;border-radius:999px;background:transparent;color:#94a3b8;font:900 .83rem var(--font);cursor:pointer}nav button.active{background:linear-gradient(100deg,#0284c7,#7c3aed);color:white;box-shadow:0 0 16px #38bdf845}.subject-album,.item-album{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}.item-album{grid-template-columns:repeat(4,minmax(0,1fr))}.album-card{--accent:#a855f7;position:relative;display:flex;min-height:300px;flex-direction:column;align-items:center;padding:13px;border:2px solid color-mix(in srgb,var(--accent) 45%,#ffffff40);border-radius:22px;background:linear-gradient(145deg,#ffffff14,#1e1b4b99 55%,#0f172a);box-shadow:inset 0 0 0 2px #ffffff08,0 8px 14px #02061770;text-align:center;overflow:hidden}.album-card.legendary{min-height:410px;border:3px solid transparent;background:linear-gradient(145deg,#ffffff12,#1e1b4bd1 55%,#0f172a) padding-box,linear-gradient(135deg,#fef3c7,color-mix(in srgb,var(--accent) 65%,#a855f7),#7dd3fc) border-box;box-shadow:inset 0 0 0 2px #ffffff10,0 12px 22px #02061780,0 0 22px color-mix(in srgb,var(--accent) 38%,transparent)}.album-card.legendary::after{content:'';position:absolute;inset:9px;border:1px solid #ffffff2b;border-radius:17px;box-shadow:inset 0 0 16px color-mix(in srgb,var(--accent) 32%,transparent);pointer-events:none}.card-heading{position:relative;z-index:3;display:flex;width:100%;min-height:48px;align-items:center;justify-content:space-between;gap:8px}.card-heading>strong{color:#fff;font-size:clamp(1.38rem,2.8vw,1.75rem);line-height:1.05;text-align:left;text-shadow:0 0 12px color-mix(in srgb,var(--accent) 65%,transparent)}.album-art{position:relative;z-index:2;display:grid;min-height:132px;place-items:center}.legendary .album-art{min-height:210px}.album-art :deep(.creature-art.subject){width:190px}.album-art :deep(.creature-art.item){width:102px}.item-art{width:100%}.item-clue{position:absolute;right:2px;bottom:8px;display:grid;place-items:center;width:44px;height:44px;border:2px solid #ffffff70;border-radius:14px;background:#f8fafce8;color:#172554;font-size:1.35rem;box-shadow:0 5px 12px #02061780}.album-copy{position:relative;z-index:2;width:100%;margin-top:auto}.album-copy h2{min-height:2.3em;margin:4px 0;color:#e0f2fe;font-size:.78rem;overflow-wrap:anywhere}.album-copy .undiscovered{display:grid;place-items:center;color:#94a3b8;font-size:.7rem}.kizuna-line{display:flex;align-items:center;justify-content:center;gap:7px;font-size:.68rem;font-weight:900}.kizuna-line span{color:#fde68a}.kizuna-line b{font-size:.9rem}.kizuna-line em{padding:3px 7px;border-radius:999px;background:#ffffff12;color:#fff;font-size:.62rem;font-style:normal}.growth-bar{height:9px;margin:7px 3px 5px;border-radius:999px;background:#020617b8;overflow:hidden}.growth-bar i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#38bdf8,#a855f7,#facc15);box-shadow:0 0 8px #38bdf8}.album-copy p{margin:5px 0;color:#cbd5e1;font-size:.65rem;font-weight:900}.album-copy>em{color:#94a3b8;font-size:.58rem;font-style:normal}.companion{min-height:250px;border-color:#38bdf850}.companion .card-heading>strong{font-size:clamp(1.2rem,2.3vw,1.52rem)}.locked{filter:saturate(.35)}.locked .album-art :deep(img){filter:brightness(.28)}.locked .album-art{opacity:.72}@media(max-width:850px){.subject-album{grid-template-columns:repeat(2,1fr)}.item-album{grid-template-columns:repeat(3,1fr)}}@media(max-width:560px){.zukan-page{padding-inline:10px}.subject-album,.item-album{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.album-card{min-height:280px;padding:10px}.album-card.legendary{min-height:365px}.companion{min-height:240px}.card-heading{min-height:54px;align-items:flex-start;flex-direction:column;gap:3px}.card-heading>strong,.companion .card-heading>strong{font-size:1.28rem}.album-art{min-height:120px}.legendary .album-art{min-height:180px}.album-art :deep(.creature-art.subject){width:160px}.album-art :deep(.creature-art.item){width:92px}.item-clue{width:38px;height:38px;font-size:1.1rem}.album-copy h2{font-size:.7rem}}
header::after{content:'';display:block;width:56px;height:56px}.mystery-art{display:grid;place-items:center;width:92px;aspect-ratio:1;border:2px solid #ffffff2c;border-radius:24%;background:radial-gradient(circle,#4338ca75,#0f172ad9);color:#c4b5fd;font-size:3.4rem;font-weight:900;box-shadow:inset 0 0 20px #a855f735,0 0 14px #38bdf824}.legendary .mystery-art{aspect-ratio:3/4;border-radius:22%}.card-heading>.rarity.companion{min-height:0;height:auto;flex:0 0 auto;align-self:center}
button.album-card{font-family:var(--font);color:inherit;cursor:pointer}.album-card.legendary{transition:transform .18s ease,box-shadow .18s ease}.album-card.legendary:active{transform:translateY(2px) scale(.99)}.tap-hint{position:relative;z-index:3;margin-top:8px;padding:5px 10px;border:1px solid #ffffff24;border-radius:999px;background:#0206178a;color:#bfdbfe;font-size:.58rem;font-weight:900}.modal-backdrop{position:fixed;z-index:40;inset:0;display:grid;place-items:center;padding:18px;background:#020617d9;backdrop-filter:blur(9px)}.evolution-modal{--accent:#a855f7;position:relative;width:min(100%,760px);max-height:min(92vh,820px);padding:22px;border:3px solid transparent;border-radius:28px;background:linear-gradient(145deg,#172554,#11133c 54%,#0f172a) padding-box,linear-gradient(135deg,#fef3c7,color-mix(in srgb,var(--accent) 72%,#a855f7),#7dd3fc) border-box;box-shadow:0 22px 40px #020617b5,0 0 34px color-mix(in srgb,var(--accent) 40%,transparent);overflow:auto}.close-modal{position:absolute;right:14px;top:14px;display:grid;place-items:center;width:48px;height:48px;border:1px solid #ffffff2b;border-radius:50%;background:#020617b8;color:#fff;font:900 1.6rem/1 var(--font)}.modal-title{display:flex;align-items:center;justify-content:center;gap:12px;padding-inline:50px}.modal-title strong{color:#fff;font-size:clamp(1.7rem,5vw,2.35rem);line-height:1;text-shadow:0 0 16px color-mix(in srgb,var(--accent) 65%,transparent)}.evolution-modal h2{margin:8px 0 10px;color:#dbeafe;text-align:center;font-size:1rem}.modal-kizuna{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:16px}.modal-kizuna span,.modal-kizuna em{padding:7px 12px;border-radius:999px;background:#020617b8;color:#fde68a;font-size:.8rem;font-weight:900;font-style:normal}.modal-kizuna em{color:#fff}.modal-kizuna b{font-size:1.05rem}.evolution-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.evolution-card{display:flex;min-height:250px;flex-direction:column;align-items:center;justify-content:flex-end;padding:10px;border:1px solid #ffffff22;border-radius:22px;background:radial-gradient(circle at 50% 28%,color-mix(in srgb,var(--accent) 24%,transparent),#02061782 62%);box-shadow:inset 0 0 0 1px #ffffff0b;text-align:center}.evolution-art{display:grid;min-height:168px;place-items:center}.evolution-art :deep(.creature-art.subject){width:150px}.evolution-card strong{color:#fff;font-size:.9rem}.evolution-card small{margin-top:4px;color:#fde68a;font-size:.66rem;font-weight:900}.evolution-card.locked{filter:saturate(.55)}.evolution-card.locked .mystery-art{width:118px;border-radius:28%;font-size:4rem}.next-note{margin:16px 0 0;color:#cbd5e1;text-align:center;font-weight:900}.next-note ruby rt{font-size:.48em}@media(max-width:700px){.evolution-modal{padding:18px 12px}.evolution-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.evolution-art{min-height:148px}.evolution-art :deep(.creature-art.subject){width:132px}.evolution-card{min-height:220px}.modal-title{padding-inline:42px}}
.evolution-card{border:3px solid transparent;background:radial-gradient(circle at 50% 28%,color-mix(in srgb,var(--rank-glow) 20%,transparent),#02061782 62%) padding-box,linear-gradient(135deg,var(--rank-a),var(--rank-b),var(--rank-a)) border-box;box-shadow:inset 0 0 0 2px #ffffff0b,0 8px 15px #02061775,0 0 16px color-mix(in srgb,var(--rank-glow) 35%,transparent)}.evolution-card.rank-found{--rank-a:#e2e8f0;--rank-b:#94a3b8;--rank-glow:#e2e8f0}.evolution-card.rank-friend{--rank-a:#bae6fd;--rank-b:#38bdf8;--rank-glow:#38bdf8}.evolution-card.rank-super{--rank-a:#ddd6fe;--rank-b:#a855f7;--rank-glow:#a855f7}.evolution-card.rank-master{--rank-a:#fef3c7;--rank-b:#facc15;--rank-glow:#facc15}.evolution-card.locked{background:radial-gradient(circle at 50% 28%,#47556955,#02061782 62%) padding-box,linear-gradient(135deg,color-mix(in srgb,var(--rank-a) 42%,#64748b),#334155,color-mix(in srgb,var(--rank-b) 42%,#64748b)) border-box;box-shadow:inset 0 0 0 2px #ffffff08,0 8px 15px #02061770}
.album-card.legendary.rank-found{background:linear-gradient(145deg,#ffffff12,#1e1b4bd1 55%,#0f172a) padding-box,linear-gradient(135deg,#e2e8f0,#94a3b8,#e2e8f0) border-box}.album-card.legendary.rank-friend{background:linear-gradient(145deg,#ffffff12,#1e1b4bd1 55%,#0f172a) padding-box,linear-gradient(135deg,#bae6fd,#38bdf8,#bae6fd) border-box;box-shadow:inset 0 0 0 2px #ffffff10,0 12px 22px #02061780,0 0 22px #38bdf852}.album-card.legendary.rank-super{background:linear-gradient(145deg,#ffffff12,#1e1b4bd1 55%,#0f172a) padding-box,linear-gradient(135deg,#ddd6fe,#a855f7,#ddd6fe) border-box;box-shadow:inset 0 0 0 2px #ffffff10,0 12px 22px #02061780,0 0 24px #a855f760}.album-card.legendary.rank-master{background:linear-gradient(145deg,#ffffff12,#1e1b4bd1 55%,#0f172a) padding-box,linear-gradient(135deg,#fef3c7,#facc15,#a855f7,#fef3c7) border-box;box-shadow:inset 0 0 0 2px #facc1524,0 12px 22px #02061780,0 0 28px #facc1560}
.album-copy h2{min-height:1.45em;white-space:nowrap}.album-copy .undiscovered{display:block;font-size:.72rem;white-space:nowrap}.album-copy h2 :deep(.monster-name){font-size:.88rem}.companion .album-copy h2 :deep(.monster-name){font-size:.84rem}
</style>
