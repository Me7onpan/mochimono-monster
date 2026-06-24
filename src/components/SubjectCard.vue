<script setup lang="ts">
import type { Subject } from '../types'
import RubyText from './RubyText.vue'
import CreatureArt from './CreatureArt.vue'
import MonsterName from './MonsterName.vue'
defineProps<{ subject: Subject; selected: boolean }>()
defineEmits<{ toggle: [] }>()
</script>

<template>
  <button class="subject-card" :class="{ selected }" :style="{ '--accent':subject.color }" @click="$emit('toggle')">
    <span class="check">{{ selected ? '✓' : '' }}</span>
    <CreatureArt kind="subject" :creature="subject.id" :active="selected" />
    <span class="copy"><b><RubyText :text="subject.label" :reading="subject.ruby" /></b><strong><MonsterName :label="subject.label" :reading="subject.ruby" :name="subject.monsterName" /></strong><small>「{{ subject.message }}」</small></span>
  </button>
</template>

<style scoped>
.subject-card{position:relative;display:flex;align-items:center;gap:15px;width:100%;min-height:166px;padding:18px;border:3px solid transparent;border-radius:30px;background:#fff;color:#46372f;text-align:left;box-shadow:0 7px 0 #e6d8c7;cursor:pointer;transition:.18s transform,.18s box-shadow,.18s border-color}.subject-card:hover{transform:translateY(-2px)}.subject-card.selected{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 11%,#fff);transform:translateY(-4px);box-shadow:0 10px 0 color-mix(in srgb,var(--accent) 35%,#ded0c0),0 0 22px color-mix(in srgb,var(--accent) 24%,transparent)}.check{position:absolute;right:14px;top:12px;width:34px;height:34px;border:3px solid #dacbbb;border-radius:11px;display:grid;place-items:center;background:#fff;color:var(--accent);font-size:22px;font-weight:900}.selected .check{border-color:var(--accent);background:var(--accent);color:#fff}.copy{display:flex;min-width:0;flex-direction:column;gap:5px}.copy b{color:var(--accent);font-size:1.4rem}.copy strong{font-size:.9rem}.copy small{padding-right:20px;color:#756258;font-size:.75rem;line-height:1.5}rt{font-size:.52em}@media(max-width:430px){.subject-card{min-height:155px;padding:15px}.subject-card :deep(.creature-art){width:82px}.copy b{font-size:1.25rem}.copy small{font-size:.7rem}}
</style>
