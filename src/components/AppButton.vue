<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'primary'|'secondary'|'cream'; disabled?: boolean }>(), { tone:'primary', disabled:false })
defineEmits<{ click: [] }>()
</script>
<template><button class="app-button" :class="tone" :disabled="disabled" @click="$emit('click')"><slot/></button></template>
<style scoped>
.app-button{width:100%;min-height:64px;padding:14px 24px;border:0;border-radius:24px;font:900 1.08rem/1.35 var(--font);letter-spacing:.03em;cursor:pointer;box-shadow:0 7px 0 var(--shadow);transition:.15s transform,.15s box-shadow}.app-button:active:not(:disabled){transform:translateY(5px);box-shadow:0 2px 0 var(--shadow)}.primary{background:#ff856c;color:white;--shadow:#c75543}.secondary{background:#50b89e;color:white;--shadow:#27836f}.cream{background:#fff;color:#5a483c;--shadow:#ded0c0}.app-button:disabled{filter:grayscale(.65);opacity:.55;cursor:not-allowed}
</style>
