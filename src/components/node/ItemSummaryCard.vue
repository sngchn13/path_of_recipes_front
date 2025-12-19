<script setup lang="ts">
import type { ItemState } from '@/shared/types'

defineProps<{
  itemState: ItemState
}>()
</script>

<template>
  <div class="item-summary-card">
    <div class="item-summary-name">
      {{ itemState.item_base.display_kor || itemState.item_base.name }}
    </div>
    <div class="item-summary-sub">
      {{ itemState.item_base.display_en || itemState.item_base.name }} ·
      {{ itemState.rarity }}
    </div>
    <div class="subtle-divider"></div>
    <div class="item-summary-sub">
      아이템 레벨 {{ itemState.item_level }}<br />
      <span v-if="itemState.note">노트: {{ itemState.note }}</span>
    </div>
  </div>
</template>

<style scoped>
.item-summary-card {
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: radial-gradient(circle at 0 0, #111827, #020617);
  font-size: 12px;
  line-height: 1.4;
}

.item-summary-name {
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 6px;
  font-size: 13px;
}

.item-summary-sub {
  color: #9ca3af;
  font-size: 11px;
}

.subtle-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(148, 163, 184, 0.4), transparent);
  margin: 8px 0;
}
</style>
