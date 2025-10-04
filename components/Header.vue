<template>
  <header class="flex items-center justify-between px-6 py-4 bg-white shadow">
    <h1 class="text-xl font-bold">🛍️ 商品商城</h1>

    <div class="flex gap-4 items-center">
      <!-- 搜尋框 -->
      <input
        id="search"
        v-model="model"
        type="text"
        placeholder="搜尋商品..."
        aria-label="搜尋商品"
        class="border rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#b9a2a6]"
      />

      <!-- 購物車按鈕 -->
      <button
        class="btn-search relative"
        @click="$emit('toggle-cart')"
        aria-label="開啟購物車"
      >
        🛒
        <span class="badge-count" v-if="cartCount > 0">
          {{ cartCount }}
        </span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: { type: String, default: '' },
  cartCount: { type: Number, default: 0 }
})

const emit = defineEmits(['update:modelValue', 'toggle-cart'])

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})
</script>
