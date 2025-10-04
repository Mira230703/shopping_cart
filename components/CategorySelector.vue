<template>
  <div
    class="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide"
    ref="scrollContainer"
    @scroll="handleScroll"
  >
    <button
      v-for="cat in categories"
      :key="cat"
      :class="[
        'px-4 py-2 rounded border whitespace-nowrap',
        selectedCategory === cat
          ? 'bg-[#b9a2a6] text-white border-[#b9a2a6]'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      ]"
      @click="$emit('update:selectedCategory', cat)"
    >
      {{ cat }}
    </button>

    <!-- 載入中提示 -->
    <div v-if="loading" class="px-4 py-2 text-gray-500">
      載入中...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  selectedCategory: { type: String, default: '全部' }
})
const emit = defineEmits(['update:selectedCategory'])

const categories = ref(['全部']) // 預設包含「全部」
const page = ref(1)
const limit = 20
const loading = ref(false)
const finished = ref(false)

async function loadCategories() {
  if (loading.value || finished.value) return
  loading.value = true
  try {
    const res = await $fetch(`/api/categories?page=${page.value}&limit=${limit}`)
    if (!res || res.length === 0) {
      finished.value = true
    } else {
      categories.value.push(...res)
      page.value++
    }
  } catch (err) {
    console.error('載入分類失敗:', err)
  } finally {
    loading.value = false
  }
}

function handleScroll(e) {
  const target = e.target
  if (target.scrollLeft + target.clientWidth >= target.scrollWidth - 50) {
    loadCategories()
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
/* 隱藏水平 scrollbar，讓 UI 更乾淨 */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
</style>
