<script setup lang="ts">
import { growthLevel, rankStarCount } from '../utils/growth'

defineProps<{ rank: string }>()
</script>

<template>
  <span class="rank-ring" aria-hidden="true"></span>
  <span v-if="growthLevel(rank)" class="lv-tag">LV.{{ growthLevel(rank) }}</span>
  <span v-if="rankStarCount(rank)" class="rank-stars" aria-hidden="true">
    <i v-for="n in rankStarCount(rank)" :key="n"></i>
  </span>
</template>
