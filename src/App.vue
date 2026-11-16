<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- Page container: 1200px content, 16px side gutter on small screens. -->
  <main id="main-content" class="mx-auto max-w-page px-4 py-8">
    <RouterView />
  </main>
</template>
