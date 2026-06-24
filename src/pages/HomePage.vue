<script setup lang="ts">
import { computed, ref } from 'vue'
import CapsuleButton from '../components/CapsuleButton.vue'
import CreatureArt from '../components/CreatureArt.vue'
import LegendarySubjectCard from '../components/LegendarySubjectCard.vue'
import StarParticles from '../components/StarParticles.vue'
import { subjectMap } from '../data/subjects'
import type { Stats, SubjectProgress, TodayState } from '../types'
const props=defineProps<{nickname:string;today:TodayState;stats:Stats;subjectProgress:SubjectProgress}>()
const emit=defineEmits<{start:[];zukan:[];saveName:[name:string]}>()
const draft=ref('');const nameOpen=ref(!props.nickname)
const todaySubjects=computed(()=>props.today.poweredSubjectMonsterIds.map(id=>Object.values(subjectMap).find(subject=>subject.monsterId===id)).filter(Boolean))
function save(){const value=draft.value.trim().slice(0,12);if(value){emit('saveName',value);nameOpen.value=false}}
</script>
<template>
  <main class="page card-hall">
    <header class="hall-header">
      <div class="crest">✦</div><div class="title"><small>まほうの カードホール</small><h1>もちものモンスター</h1><p>{{ nickname }}くん、おかえり！</p></div>
      <div class="stats"><span>★ きずな <b>{{ stats.totalStars }}</b></span><span>🔥 れんぞく <b>{{ stats.streak }}</b></span></div>
    </header>
    <section class="today-stage">
      <div class="section-title"><span>✦</span><h2><small>きょうの</small> <ruby>伝説<rt>でんせつ</rt></ruby>カード</h2><span>✦</span></div>
      <div v-if="today.isCompleted" class="today-cards">
        <LegendarySubjectCard v-for="subject in todaySubjects" :key="subject!.id" :subject="subject!" :count="subjectProgress[subject!.monsterId]?.completedCount||0" display-only compact/>
      </div>
      <div v-else class="mystery-card">
        <StarParticles :count="12"/><div class="card-back-ring"><span>?</span></div><b>きょうの カードを<br>あつめよう！</b><small>じゅんびで でんせつが めざめる</small>
      </div>
    </section>
    <div class="hall-actions"><CapsuleButton tone="gold" @click="emit('start')"><template v-if="today.isCompleted">✦ きょうの カードを みる</template><template v-else>✦ <ruby>明日<rt>あした</rt></ruby>の じゅぎょうを えらぶ</template></CapsuleButton><CapsuleButton tone="glass" @click="emit('zukan')"><span class="zukan-icon" aria-hidden="true"><svg viewBox="0 0 64 64"><path class="book" d="M8 12c8-3 16-1 24 5 8-6 16-8 24-5v39c-8-2-16 0-24 6-8-6-16-8-24-6Z"/><path class="spine" d="M32 17v40"/><path class="card" d="m19 23 8 2-1 15-9-2Z"/><path class="gem" d="m45 21 4 6-4 6-4-6Z"/><path class="shine" d="m49 11 1.5 4.5L55 17l-4.5 1.5L49 23l-1.5-4.5L43 17l4.5-1.5Z"/></svg></span>モンスターずかん</CapsuleButton></div>
    <div v-if="nameOpen" class="modal-backdrop"><form class="name-card" @submit.prevent="save"><CreatureArt kind="subject" creature="japanese" size="large" active/><h2>なまえを おしえて！</h2><input v-model="draft" maxlength="12" autocomplete="nickname" placeholder="なまえ" autofocus/><CapsuleButton :disabled="!draft.trim()" @click="save">OK！</CapsuleButton></form></div>
  </main>
</template>
<style scoped>
.card-hall{padding:22px 20px 46px}.hall-header{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:14px;max-width:980px;margin:auto;padding:12px 16px;border:1px solid #ffffff1f;border-radius:24px;background:#ffffff0b;backdrop-filter:blur(10px)}.crest{display:grid;place-items:center;width:54px;height:54px;border:2px solid #fde68a;border-radius:18px;background:linear-gradient(145deg,#f59e0b,#7c3aed);color:#fff;font-size:1.7rem;box-shadow:0 0 20px #facc1550}.title small{color:#7dd3fc;font-size:.65rem;font-weight:900}.title h1{margin:1px 0;color:#fff;font-size:clamp(1.35rem,4vw,2.1rem);letter-spacing:.02em}.title p{margin:0;color:var(--text-soft);font-size:.76rem}.stats{display:flex;flex-direction:column;gap:6px}.stats span{padding:6px 10px;border-radius:999px;background:#0206176b;color:var(--text-soft);font-size:.65rem;font-weight:900}.stats b{color:#fde68a}.today-stage{max-width:970px;margin:25px auto 0}.section-title{display:flex;align-items:center;justify-content:center;gap:13px;text-align:center}.section-title>span{color:#fde68a}.section-title small{color:#94a3b8}.section-title h2{margin:0;font-size:1.35rem}.today-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,330px));justify-content:center;gap:18px;margin-top:15px}.mystery-card{position:relative;display:flex;width:min(100%,300px);min-height:360px;flex-direction:column;align-items:center;justify-content:center;gap:13px;margin:15px auto 0;border:3px solid #c4b5fd;border-radius:28px;background:radial-gradient(circle,#4338ca66,#111c3d 65%),repeating-linear-gradient(45deg,#ffffff05 0 8px,transparent 8px 16px);box-shadow:inset 0 0 0 5px #ffffff0b,0 0 28px #8b5cf65c,0 18px 30px #02061780;text-align:center;overflow:hidden}.card-back-ring{display:grid;place-items:center;width:145px;aspect-ratio:1;border:2px solid #fde68a;border-radius:50%;box-shadow:0 0 25px #facc1545,inset 0 0 20px #a855f74a}.card-back-ring span{font-size:4rem;font-weight:900;color:#fff}.mystery-card b{font-size:1.18rem}.mystery-card small{color:#a5b4fc}.hall-actions{display:grid;grid-template-columns:1.4fr 1fr;gap:14px;max-width:760px;margin:28px auto 0}.hall-actions :deep(.capsule){min-height:76px}.hall-actions :deep(.glass){display:flex;align-items:center;justify-content:center;gap:11px}.zukan-icon{position:relative;display:grid;place-items:center;width:54px;height:54px;flex:0 0 54px;border:1px solid #93c5fd66;border-radius:17px;background:radial-gradient(circle at 50% 30%,#4338ca,#172554 70%);box-shadow:inset 0 0 14px #38bdf83d,0 0 16px #8b5cf64d}.zukan-icon svg{width:46px;height:46px;filter:drop-shadow(0 3px 3px #02061799)}.zukan-icon .book{fill:#1e3a8a;stroke:#93c5fd;stroke-width:2.4;stroke-linejoin:round}.zukan-icon .spine{fill:none;stroke:#c4b5fd;stroke-width:2}.zukan-icon .card{fill:#7c3aed;stroke:#fde68a;stroke-width:1.8}.zukan-icon .gem{fill:#38bdf8;stroke:#e0f2fe;stroke-width:1.5}.zukan-icon .shine{fill:#fde68a}.modal-backdrop{position:fixed;z-index:20;inset:0;display:grid;place-items:center;padding:24px;background:#020617dc;backdrop-filter:blur(9px)}.name-card{display:flex;flex-direction:column;align-items:center;width:min(100%,430px);padding:28px 25px;border:2px solid #fde68a;border-radius:30px;background:linear-gradient(155deg,#312e81,#0f172a);box-shadow:0 0 40px #8b5cf650}.name-card h2{margin:17px 0}.name-card input{width:100%;min-height:64px;margin-bottom:18px;padding:12px 18px;border:2px solid #ffffff30;border-radius:18px;background:#ffffff12;color:#fff;font:900 1.25rem var(--font);text-align:center;outline:none}@media(max-width:650px){.hall-header{grid-template-columns:auto 1fr}.stats{grid-column:1/-1;flex-direction:row;justify-content:center}.hall-actions{grid-template-columns:1fr}.card-hall{padding-inline:14px}.mystery-card{min-height:330px}}
.today-cards{gap:24px;margin-top:22px}.today-cards :deep(.legend-card){margin-block:3px}
</style>
