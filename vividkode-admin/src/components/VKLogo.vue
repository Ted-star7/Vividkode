<template>
  <svg 
    :width="width" 
    :height="height" 
    viewBox="0 0 200 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- VK Monogram -->
    <!-- V shape -->
    <path d="M30 40 L100 145 L170 40 L148 40 L100 115 L52 40 Z" :fill="color" />
    <!-- K shape overlapping -->
    <path d="M115 40 L115 95 L158 40 L180 40 L137 92 L183 155 L161 155 L115 100 L115 155 L95 155 L95 40 Z" :fill="color" opacity="0.85"/>
  </svg>
</template>

<script setup>
defineProps({
  width: { type: [Number, String], default: 40 },
  height: { type: [Number, String], default: 40 },
  color: { type: String, default: '#0a1929' }
})
</script>
