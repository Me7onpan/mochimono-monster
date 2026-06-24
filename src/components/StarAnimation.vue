<template><div class="star-field" aria-hidden="true"><i v-for="n in 18" :key="n" :style="{ '--i': n }">★</i></div></template>
<style scoped>
.star-field{position:absolute;inset:0;overflow:hidden;pointer-events:none}.star-field i{position:absolute;left:calc((var(--i) * 37) % 100 * 1%);top:110%;color:#ffd85a;font-style:normal;font-size:calc(12px + (var(--i) % 4) * 7px);animation:float-star calc(2.4s + (var(--i) % 5) * .35s) calc((var(--i) % 6) * -.4s) linear infinite;text-shadow:0 2px 0 #e3a83e}@keyframes float-star{to{transform:translateY(-125vh) rotate(360deg)}}
</style>
