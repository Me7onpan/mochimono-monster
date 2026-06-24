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
</script>
<template>
  <component :is="displayOnly?'article':'button'" class="legend-card" :class="{selected,compact}" :style="{'--accent':subject.color}" @click="!displayOnly&&$emit('toggle')">
    <FoilLayer :class="{active:selected}"/><StarParticles v-if="selected" :count="8"/>
    <div class="card-top"><span class="kizuna">★ きずな <b>{{ count }}</b><em>{{ growth.rank }}</em></span></div>
    <div class="art-stage"><div class="magic-ring"/><CreatureArt kind="subject" :creature="subject.id" :active="selected" size="large"/></div>
    <div class="card-copy"><div class="subject-title"><strong><RubyText :text="subject.label" :reading="subject.ruby" /></strong><RarityBadge/></div><h2><MonsterName :label="subject.label" :reading="subject.ruby" :name="subject.monsterName" /></h2><p>「{{ subject.message }}」</p></div>
    <span v-if="!displayOnly" class="select-mark">{{ selected?'✓':'＋' }}</span>
  </component>
</template>
<style scoped>
.legend-card{--accent:#facc15;position:relative;display:grid;grid-template-rows:auto 1fr auto;width:100%;min-height:335px;padding:15px;border:2px solid color-mix(in srgb,var(--accent) 58%,#e9d5ff);border-radius:var(--radius-card);background:linear-gradient(155deg,#ffffff18,#312e814f 48%,#0f172ae8);color:var(--text-main);text-align:left;box-shadow:inset 0 0 0 3px #ffffff09,0 12px 22px #02061770,0 0 16px color-mix(in srgb,var(--accent) 18%,transparent);overflow:hidden;cursor:pointer;transform-style:preserve-3d;transition:.24s transform,.24s border-color,.24s box-shadow}.legend-card:not(article):hover{transform:perspective(900px) rotateX(1.5deg) rotateY(-2deg) translateY(-4px)}.legend-card.selected{border-color:var(--gold);transform:translateY(-7px) scale(1.015);box-shadow:inset 0 0 28px color-mix(in srgb,var(--accent) 25%,transparent),0 14px 26px #0206178a,0 0 28px #facc1570}.card-top{position:relative;z-index:3}.kizuna{display:inline-flex;align-items:center;gap:6px;min-height:30px;padding:5px 10px;border:1px solid #fde68a85;border-radius:999px;background:#0f172ad6;color:#fde68a;font-size:.68rem;font-weight:900;box-shadow:0 0 13px #facc1527}.kizuna b{font-size:.88rem}.kizuna em{padding-left:7px;border-left:1px solid #ffffff36;color:#fff;font-style:normal}.art-stage{position:relative;z-index:2;display:grid;place-items:center;min-height:170px}.art-stage :deep(.creature-art){width:126px;border-color:#fef3c7;box-shadow:0 0 18px color-mix(in srgb,var(--accent) 48%,transparent),0 7px 0 #02061770}.magic-ring{position:absolute;width:155px;aspect-ratio:1;border:1px solid #ffffff24;border-radius:50%;box-shadow:inset 0 0 22px color-mix(in srgb,var(--accent) 35%,transparent);background:repeating-conic-gradient(from 0deg,#fff0 0 20deg,#ffffff16 21deg 22deg)}.card-copy{position:relative;z-index:3;padding:12px;border:1px solid #ffffff1f;border-radius:16px;background:#02061766;backdrop-filter:blur(5px)}.subject-title{display:flex;align-items:center;justify-content:space-between;gap:8px}.subject-title strong{color:#fff;font-size:clamp(1.32rem,3vw,1.65rem);line-height:1.1;text-shadow:0 0 12px color-mix(in srgb,var(--accent) 58%,transparent)}.card-copy h2{margin:7px 0 4px;color:#fff;font-size:.9rem}.card-copy p{margin:0;color:var(--text-soft);font-size:.68rem;line-height:1.5}.select-mark{position:absolute;z-index:5;right:14px;top:48px;display:grid;place-items:center;width:38px;height:38px;border:2px solid #ffffff58;border-radius:50%;background:#0f172ad9;color:white;font-size:1.3rem;font-weight:900}.selected .select-mark{border-color:#fde68a;background:#f59e0b;box-shadow:0 0 15px #facc15}.legend-card.compact{min-height:295px}.legend-card.compact .art-stage{min-height:150px}@media(max-width:520px){.legend-card{min-height:310px}.art-stage{min-height:155px}.art-stage :deep(.creature-art){width:112px}}
.card-top{margin-bottom:12px}.card-copy{margin-top:12px}.legend-card.compact{padding:18px}.legend-card.compact .card-top{margin-bottom:14px}.legend-card.compact .card-copy{margin-top:14px}
</style>
