<script setup lang="ts">withDefaults(defineProps<{ type?:'legendary'|'companion' }>(),{type:'legendary'})</script>
<template><span class="rarity" :class="type"><ruby v-if="type==='legendary'">伝説<rt>でんせつ</rt></ruby><ruby v-else>仲間<rt>なかま</rt></ruby></span></template>
<style scoped>
.rarity{display:inline-flex;align-items:center;padding:4px 9px;border:1px solid #ffffff30;border-radius:999px;background:#0f172ab8;color:#e2e8f0;font-size:.58rem;font-weight:900;letter-spacing:.06em}.rarity.legendary{border-color:#fde68a70;color:#fde68a}.rarity.companion{border-color:#86efac65;color:#bbf7d0}
</style>
