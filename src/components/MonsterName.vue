<script setup lang="ts">
import { computed } from 'vue'
import RubyText from './RubyText.vue'

const props = defineProps<{ label: string; reading: string; name: string }>()
const suffix = computed(() => props.name.startsWith(props.label) ? props.name.slice(props.label.length) : props.name)
</script>

<template><span class="monster-name"><RubyText :text="label" :reading="reading" />{{ suffix }}</span></template>
