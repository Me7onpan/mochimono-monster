<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  kind: 'subject' | 'item'
  creature: string
  size?: 'small' | 'medium' | 'large'
  active?: boolean
}>(), { size: 'medium', active: false })

const artSrc = computed(() => `${import.meta.env.BASE_URL}art/${props.kind === 'subject' ? 'subjects' : 'items'}/${props.creature}.png`)
</script>

<template>
  <div class="creature-art" :class="[kind, size, { active }]">
    <img :src="artSrc" :alt="creature" draggable="false" />
  </div>
</template>

<style scoped>
.creature-art{position:relative;display:grid;place-items:center;flex:0 0 auto;width:82px;aspect-ratio:1;border-radius:24%;overflow:hidden;background:#fff7e5;box-shadow:0 5px 0 #593d2726;transition:transform .2s ease,filter .2s ease}.creature-art img{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:contain;user-select:none}.creature-art.small{width:56px;border-radius:20%}.creature-art.large{width:112px}.creature-art.subject{width:94px;aspect-ratio:3/4;border:3px solid #fff}.creature-art.subject.small{width:58px}.creature-art.subject.large{width:118px}.creature-art.item{width:74px;border:2px solid #fff}.creature-art.item.small{width:54px}.creature-art.item.large{width:104px}.creature-art.active{animation:creature-pop .7s ease-in-out infinite alternate;filter:saturate(1.08)}@keyframes creature-pop{to{transform:translateY(-5px) rotate(1.5deg)}}
</style>
