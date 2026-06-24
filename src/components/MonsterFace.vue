<script setup lang="ts">
withDefaults(defineProps<{ kind?: 'subject' | 'item'; color?: string; symbol?: string; happy?: boolean }>(), { kind:'item', color:'#ffad70', symbol:'★', happy:false })
</script>
<template>
  <div class="monster-face" :class="[kind, { happy }]" :style="{ '--monster-color': color }" aria-hidden="true">
    <i class="ear left"/><i class="ear right"/><span class="symbol">{{ symbol }}</span>
    <span class="eye left"/><span class="eye right"/><span class="mouth"/>
  </div>
</template>
<style scoped>
.monster-face{--monster-color:#ffad70;position:relative;width:72px;height:64px;border-radius:44% 44% 42% 42%;background:var(--monster-color);box-shadow:inset 0 -7px 0 #0000000b,0 7px 0 #362b2440;flex:0 0 auto}.monster-face.subject{width:86px;height:74px;border-radius:45% 45% 36% 36%}.ear{position:absolute;top:-10px;width:25px;height:28px;background:var(--monster-color);border-radius:70% 15% 55% 30%;z-index:-1}.ear.left{left:5px;transform:rotate(-25deg)}.ear.right{right:5px;transform:scaleX(-1) rotate(-25deg)}.eye{position:absolute;top:28px;width:7px;height:10px;background:#332923;border-radius:50%}.eye.left{left:22px}.eye.right{right:22px}.mouth{position:absolute;left:50%;bottom:13px;width:16px;height:8px;border-bottom:3px solid #332923;border-radius:0 0 50% 50%;transform:translateX(-50%)}.symbol{position:absolute;top:5px;left:50%;transform:translateX(-50%);font-size:15px;color:#fff8;font-weight:900}.happy .mouth{height:10px;background:#fff3;border:0;border-radius:3px 3px 12px 12px}.happy{animation:bob .7s ease-in-out infinite alternate}@keyframes bob{to{transform:translateY(-5px) rotate(2deg)}}
</style>
