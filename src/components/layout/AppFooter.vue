<script setup>
import { ExternalLink } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import { NAV_CATEGORIES } from '@/config/catalog'
import { PAYMENT_METHODS, REPOSITORY_URL } from '@/config/project'
import { productListRoute } from '@/utils/routes'

import AppLogo from '@/components/layout/AppLogo.vue'
import FooterNewsletter from '@/components/layout/FooterNewsletter.vue'
import SupportContact from '@/components/layout/SupportContact.vue'

const { t } = useI18n()
const year = new Date().getFullYear()

const HEADING_CLASS = 'mb-3 font-heading text-lg font-medium'
</script>

<template>
  <footer class="mt-16 border-t border-border-subtle bg-bg-subtle">
    <div
      class="page-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr_1.6fr]"
    >
      <div class="flex flex-col gap-4">
        <AppLogo />
        <p class="max-w-64 text-sm text-text-muted">{{ t('footer.description') }}</p>
      </div>

      <nav aria-labelledby="footer-categories">
        <h2 id="footer-categories" :class="HEADING_CLASS">{{ t('footer.categoriesTitle') }}</h2>
        <ul class="flex flex-col gap-2 text-sm">
          <li v-for="category in NAV_CATEGORIES" :key="category.slug">
            <RouterLink
              :to="productListRoute({ category: category.slug })"
              class="text-text-muted hover:text-text-brand hover:underline"
            >
              {{ t(category.labelKey) }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <section aria-labelledby="footer-support">
        <h2 id="footer-support" :class="HEADING_CLASS">{{ t('footer.supportTitle') }}</h2>
        <SupportContact vertical class="text-sm text-text-muted" />
      </section>

      <section aria-labelledby="footer-project">
        <h2 id="footer-project" :class="HEADING_CLASS">{{ t('footer.projectTitle') }}</h2>
        <a
          :href="REPOSITORY_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-brand hover:underline"
        >
          {{ t('footer.sourceCode') }}
          <ExternalLink :size="14" aria-hidden="true" />
          <span class="sr-only">{{ t('footer.opensInNewTab') }}</span>
        </a>
      </section>

      <FooterNewsletter />
    </div>

    <div
      class="page-container flex flex-col gap-4 border-t border-border-subtle py-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-xs text-text-muted">{{ t('footer.copyright', { year }) }}</p>
      <ul :aria-label="t('footer.paymentMethods')" class="flex flex-wrap gap-2">
        <li
          v-for="method in PAYMENT_METHODS"
          :key="method"
          class="rounded-sm border border-border-subtle bg-bg-surface px-2 py-1 text-xs text-text-muted"
        >
          {{ t(`footer.payments.${method}`) }}
        </li>
      </ul>
    </div>
  </footer>
</template>
