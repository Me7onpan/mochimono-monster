<script setup lang="ts">withDefaults(defineProps<{ count?:number }>(),{count:10})</script>
<template><span class="particles" aria-hidden="true"><i v-for="n in count" :key="n" :style="{'--n':n}">✦</i></span></template>
<style scoped>
.particles{position:absolute;z-index:4;inset:-12px;overflow:hidden;pointer-events:none}.particles i{position:absolute;left:calc((var(--n)*31)%95*1%);top:calc((var(--n)*47)%85*1%);color:#fde68a;font-style:normal;font-size:calc(8px + (var(--n)%3)*4px);opacity:0;animation:particle 1.2s calc(var(--n)*-.08s) ease-in-out infinite}@keyframes particle{0%,100%{opacity:0;transform:scale(.2) rotate(0)}50%{opacity:1;transform:scale(1) rotate(90deg)}}
</style>
