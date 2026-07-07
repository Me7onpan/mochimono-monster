<script setup lang="ts">
import { computed } from 'vue'
import type { Subject } from '../types'
import CreatureArt from './CreatureArt.vue'
import RubyText from './RubyText.vue'
import MonsterName from './MonsterName.vue'
import RarityBadge from './RarityBadge.vue'
import FoilLayer from './FoilLayer.vue'
import StarParticles from './StarParticles.vue'
import { growthInfo } from '../utils/growth'
const props=withDefaults(defineProps<{subject:Subject;selected?:boolean;count?:number;displayOnly?:boolean;compact?:boolean}>(),{selected:false,count:0,displayOnly:false,compact:false})
defineEmits<{toggle:[]}>()
const growth=computed(()=>growthInfo(props.count))
const rankClass=computed(()=>({
  'まだ ひみつ':'rank-found',
  'みつけた':'rank-found',
  'なかよし':'rank-friend',
  'スーパー':'rank-super',
  'マスター':'rank-master',
}[growth.value.rank]))
</script>
<template>
  <component :is="displayOnly?'article':'button'" class="legend-card" :class="[{selected,compact}, rankClass]" :style="{'--accent':subject.color}" @click="!displayOnly&&$emit('toggle')">
    <FoilLayer :class="{active:selected}"/><StarParticles v-if="selected" :count="8"/><span class="frame-lines" aria-hidden="true"/>
    <div class="card-top"><span class="kizuna">★ きずな <b>{{ count }}</b><em>{{ growth.rank }}</em></span></div>
    <div class="art-stage"><CreatureArt kind="subject" :creature="subject.id" :active="selected" :rank="growth.rank" size="large"/></div>
    <div class="card-copy"><div class="subject-title"><strong><RubyText :text="subject.label" :reading="subject.ruby" /></strong><RarityBadge/></div><h2><MonsterName :label="subject.label" :reading="subject.ruby" :name="subject.monsterName" /></h2><p>「{{ subject.message }}」</p></div>
    <span v-if="!displayOnly" class="select-mark">{{ selected?'✓':'＋' }}</span>
  </component>
</template>
<style scoped>
.legend-card{--accent:#facc15;--frame-a:#e2e8f0;--frame-b:#94a3b8;--frame-glow:#ffffff22;position:relative;display:grid;grid-template-rows:auto 1fr auto;width:100%;min-height:410px;padding:16px;border:3px solid transparent;border-radius:var(--radius-card);background:linear-gradient(155deg,#1b1b55,#17133f 48%,#0f172a) padding-box,linear-gradient(135deg,var(--frame-a),var(--frame-b),var(--frame-a)) border-box;color:var(--text-main);text-align:left;box-shadow:inset 0 0 0 2px #ffffff0b,0 12px 22px #02061770,0 0 16px color-mix(in srgb,var(--accent) 18%,transparent);overflow:hidden;cursor:pointer;transform-style:preserve-3d;transition:.24s transform,.24s box-shadow}.legend-card::before{content:'';position:absolute;z-index:1;inset:8px;border-radius:18px;border:1px solid color-mix(in srgb,var(--frame-a) 70%,transparent);box-shadow:inset 0 0 12px var(--frame-glow);pointer-events:none}.frame-lines{position:absolute;z-index:1;inset:15px;border-radius:16px;background:linear-gradient(90deg,var(--frame-glow) 0 28px,transparent 28px calc(100% - 28px),var(--frame-glow) calc(100% - 28px)),linear-gradient(0deg,var(--frame-glow) 0 28px,transparent 28px calc(100% - 28px),var(--frame-glow) calc(100% - 28px));background-size:100% 2px,2px 100%;background-position:top left,top left;background-repeat:no-repeat;opacity:.95;pointer-events:none}.legend-card.rank-found{--frame-a:#f8fafc;--frame-b:#94a3b8;--frame-glow:#ffffff24}.legend-card.rank-friend{--frame-a:#bae6fd;--frame-b:#38bdf8;--frame-glow:#38bdf85f;box-shadow:inset 0 0 0 2px #38bdf81f,0 12px 22px #02061770,0 0 24px #38bdf852}.legend-card.rank-super{--frame-a:#ddd6fe;--frame-b:#a855f7;--frame-glow:#a855f766;box-shadow:inset 0 0 0 2px #a855f72b,0 14px 25px #02061778,0 0 30px #a855f760}.legend-card.rank-master{--frame-a:#fef3c7;--frame-b:#facc15;--frame-glow:#facc1577;box-shadow:inset 0 0 0 3px #facc1526,inset 0 0 24px #a855f724,0 16px 28px #02061782,0 0 36px #facc1568}.legend-card.rank-master::before{border-color:#fef3c7;box-shadow:inset 0 0 18px #facc154f,0 0 12px #facc153d}.legend-card:not(article):hover{transform:perspective(900px) rotateX(1.5deg) rotateY(-2deg) translateY(-4px)}.legend-card.selected{transform:translateY(-7px) scale(1.015);box-shadow:inset 0 0 28px color-mix(in srgb,var(--accent) 25%,transparent),0 14px 26px #0206178a,0 0 28px #facc1570}.card-top{position:relative;z-index:3}.kizuna{display:inline-flex;align-items:center;gap:6px;min-height:30px;padding:5px 10px;border:1px solid #fde68a85;border-radius:999px;background:#0f172ad6;color:#fde68a;font-size:.68rem;font-weight:900;box-shadow:0 0 13px #facc1527}.kizuna b{font-size:.88rem}.kizuna em{padding-left:7px;border-left:1px solid #ffffff36;color:#fff;font-style:normal}.art-stage{position:relative;z-index:2;display:grid;place-items:center;min-height:245px}.art-stage :deep(.creature-art){width:220px;box-shadow:0 0 24px color-mix(in srgb,var(--accent) 50%,transparent),0 8px 0 #02061770}.card-copy{position:relative;z-index:3;padding:12px;border:1px solid #ffffff1f;border-radius:16px;background:#02061766;backdrop-filter:blur(5px)}.subject-title{display:flex;align-items:center;justify-content:space-between;gap:8px}.subject-title strong{color:#fff;font-size:clamp(1.32rem,3vw,1.65rem);line-height:1.1;text-shadow:0 0 12px color-mix(in srgb,var(--accent) 58%,transparent)}.card-copy h2{margin:7px 0 4px;color:#fff;font-size:.9rem}.card-copy p{margin:0;color:var(--text-soft);font-size:.68rem;line-height:1.5}.select-mark{position:absolute;z-index:5;right:14px;top:48px;display:grid;place-items:center;width:38px;height:38px;border:2px solid #ffffff58;border-radius:50%;background:#0f172ad9;color:white;font-size:1.3rem;font-weight:900}.selected .select-mark{border-color:#fde68a;background:#f59e0b;box-shadow:0 0 15px #facc15}.legend-card.compact{min-height:360px}.legend-card.compact .art-stage{min-height:210px}.legend-card.compact .art-stage :deep(.creature-art){width:185px}@media(max-width:520px){.legend-card{min-height:380px}.art-stage{min-height:220px}.art-stage :deep(.creature-art){width:196px}}
.card-top{margin-bottom:12px}.card-copy{margin-top:12px}.legend-card.compact{padding:18px}.legend-card.compact .card-top{margin-bottom:14px}.legend-card.compact .card-copy{margin-top:14px}
.legend-card{cursor:default}button.legend-card{cursor:pointer}
</style>
