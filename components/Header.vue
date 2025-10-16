<template>
  <header class="flex items-center justify-between px-6 py-4 bg-white shadow">
    <!-- ✅ 點擊可回首頁並重整 -->
    <h1 class="text-xl font-bold">
      <a
        href="/"
        @click.prevent="reloadHome"
        class="hover:text-[#b9a2a6] transition"
      >
        🛍️ 商品商城
      </a>
    </h1>

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
        <span
          v-if="cartCount > 0"
          class="absolute -top-1 -right-2 bg-[#b9a2a6] text-white text-xs rounded-full px-1.5 py-0.5"
        >
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

/**
 * ✅ 點擊品牌時重整首頁（等同 F5）
 */
function reloadHome() {
  // 若已在首頁，也會強制整頁重新載入
  if (process.client) {
    window.location.href = '/' // 等同 F5：會重載整個頁面
  }
}
</script>

<style scoped>
.btn-search {
  position: relative;
  font-size: 1.25rem;
  cursor: pointer;
}
</style>
