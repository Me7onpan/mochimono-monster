<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ text: string; reading?: string }>()
const kanjiPattern = /^[一-龯々]+$/
const toHiragana = (value:string) => value.replace(/[ァ-ヶ]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 0x60)).toLowerCase()

const parts = computed(() => {
  if (!props.reading || !/[一-龯々]/.test(props.text)) return [{ text:props.text }]
  const segments = props.text.match(/[一-龯々]+|[^一-龯々]+/g) || [props.text]
  const reading = toHiragana(props.reading)
  let cursor = 0
  return segments.map((text, index) => {
    if (!kanjiPattern.test(text)) {
      const literal = toHiragana(text)
      const position = reading.indexOf(literal, cursor)
      cursor = position >= 0 ? position + literal.length : cursor + literal.length
      return { text }
    }
    const nextLiteral = segments.slice(index + 1).find((segment) => !kanjiPattern.test(segment))
    const boundary = nextLiteral ? reading.indexOf(toHiragana(nextLiteral), cursor) : reading.length
    const ruby = reading.slice(cursor, boundary >= cursor ? boundary : reading.length)
    cursor += ruby.length
    return { text, reading:ruby }
  })
})
</script>

<template><template v-for="(part,index) in parts" :key="index"><ruby v-if="part.reading">{{ part.text }}<rt>{{ part.reading }}</rt></ruby><template v-else>{{ part.text }}</template></template></template>
