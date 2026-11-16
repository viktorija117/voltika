<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

// Attributes (class, aria-label) belong on the <a>, not on RouterLink.
defineOptions({ inheritAttrs: false })

const props = defineProps({
  to: { type: [String, Object], required: true },
})

const route = useRoute()
const router = useRouter()

function isSameQuery(a, b) {
  const keys = Object.keys(a)
  return (
    keys.length === Object.keys(b).length && keys.every((key) => String(a[key]) === String(b[key]))
  )
}

// RouterLink marks a link as current by path only, so on /proizvodi?kategorija=laptops every
// category link (and every result page) would be announced as "current page".
// This compares the query and the #anchor too.
const isCurrent = computed(() => {
  const target = router.resolve(props.to)
  return (
    target.path === route.path &&
    target.hash === route.hash &&
    isSameQuery(target.query, route.query)
  )
})
</script>

<template>
  <RouterLink v-slot="{ href, navigate }" :to="to" custom>
    <a
      :href="href"
      :aria-current="isCurrent ? 'page' : undefined"
      v-bind="$attrs"
      @click="navigate"
    >
      <slot />
    </a>
  </RouterLink>
</template>
